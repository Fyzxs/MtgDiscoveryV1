using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using MtgDiscoveryAzFuncs.dtos;
using MtgDiscoveryAzFuncs.sprocs;

namespace MtgDiscoveryAzFuncs
{
    public static class AzFuncSetCardsCardBoxForUser
    {
        [FunctionName(nameof(AzFuncSetCardsCardBoxForUser))]
        public static async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, Route = "v2/set/{setCodes}/cards/{userId}")] HttpRequest req, string setCodes, string userId, ExecutionContext exCtx, ILogger log)
        {
            TraceLogger trace = new TraceLogger(log);
            log.LogInformation($"Request for [set={setCodes}] cards for [userId={userId}]");
            trace.LifeTimeStart(exCtx);

            HashSet<CardBoxInfo> collectionSet = new HashSet<CardBoxInfo>(new CardBoxInfoComparer());
            string[] setCodeArray = setCodes.Split(",");
            Task<List<CardBoxInfo>>[] taskCollection = new Task<List<CardBoxInfo>>[setCodeArray.Length];

            for (int setIndex = 0; setIndex < setCodeArray.Length; setIndex++)
            {
                taskCollection[setIndex] = (SelectWhichSproc(userId, setCodeArray[setIndex]).Execute(trace));
            }

            Task.WaitAll(taskCollection);
            
            for (int setIndex = 0; setIndex < setCodeArray.Length; setIndex++)
            {
                foreach (CardBoxInfo cardBox in (await taskCollection[setIndex]))
                {
                    collectionSet.Add(cardBox);
                }
            }

            trace.LifeTimeEnd(exCtx);
            return new JsonResult(collectionSet);
        }

        private static SelectCardBoxes SelectWhichSproc(string userId, string code)
        {
            return code.Contains("-t") ? SelectTokenSproc(code, userId) : SelectSproc(code, userId);
        }

        private static SelectCardBoxes SelectSproc(string setCode, string userId)
        {
            int indexOf = setCode.IndexOf("-", StringComparison.Ordinal);
            string actualSetCode = indexOf == -1 ? setCode : setCode.Substring(0, indexOf);
            string lower = setCode.ToLower();
            bool isFoil = lower.Contains("-f");
            bool isExtended = lower.Contains("-e");

            if (isFoil && isExtended) return new SelectExtendedFoilCardBoxesForUser(actualSetCode, userId);
            if (isFoil) return new SelectFoilCardBoxesForUser(actualSetCode, userId);
            if (isExtended) return new SelectExtendedCardBoxesForUser(actualSetCode, userId);
            return new SelectRegularCardBoxesForUser(setCode, userId);
        }
        private static SelectCardBoxes SelectTokenSproc(string setCode, string userId)
        {
            int indexOf = setCode.IndexOf("-", StringComparison.Ordinal);
            string actualSetCode = (indexOf == -1 ? setCode : setCode.Substring(0, indexOf)) + "-t";
            string lower = setCode.ToLower();
            bool isFoil = lower.Contains("-f");
            bool isExtended = lower.Contains("-e");

            if (isFoil && isExtended) return new SelectExtendedFoilCardBoxesForUser(actualSetCode, userId);
            if (isFoil) return new SelectFoilCardBoxesForUser(actualSetCode, userId);
            if (isExtended) return new SelectExtendedCardBoxesForUser(actualSetCode, userId);
            return new SelectRegularCardBoxesForUser(actualSetCode, userId);
        }
    }
}