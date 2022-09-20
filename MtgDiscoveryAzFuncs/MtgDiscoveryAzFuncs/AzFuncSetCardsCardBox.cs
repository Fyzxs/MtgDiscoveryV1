using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using MtgDiscoveryAzFuncs.dtos;
using MtgDiscoveryAzFuncs.sprocs;

namespace MtgDiscoveryAzFuncs
{
    public static class AzFuncSetCardsCardBox
    {
        [FunctionName(nameof(AzFuncSetCardsCardBox))]
        public static async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, Route = "v2/set/{setCodes}/cards")] HttpRequest req, string setCodes, ExecutionContext exCtx, ILogger log)
        {
            TraceLogger trace = new TraceLogger(log);
            log.LogInformation($"Request for [set={setCodes}] cards");
            trace.LifeTimeStart(exCtx);

            HashSet<CardBoxInfo> collectionSet = new HashSet<CardBoxInfo>(new CardBoxInfoComparer());
            string[] setCodeArray = setCodes.Split(",");
            Task<List<CardBoxInfo>>[] taskCollection = new Task<List<CardBoxInfo>>[setCodeArray.Length];

            for (int setIndex = 0; setIndex < setCodeArray.Length; setIndex++)
            {
                taskCollection[setIndex] = SelectWhichSproc(setCodeArray[setIndex]).Execute(trace);
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

        private static SelectCardBoxes SelectWhichSproc(string code)
        {
            return code.Contains("-t") ? SelectTokenSproc(code) : SelectSproc(code);
        }

        private static SelectCardBoxes SelectSproc(string setCode)
        {
            int indexOf = setCode.IndexOf("-", StringComparison.Ordinal);
            string actualSetCode = indexOf == -1 ? setCode : setCode.Substring(0, indexOf);
            string lower = setCode.ToLower();
            bool isFoil = lower.Contains("-f");
            bool isExtended = lower.Contains("-e");

            if (isFoil && isExtended) return new SelectExtendedFoilCardBoxes(actualSetCode);
            if (isFoil) return new SelectFoilCardBoxes(actualSetCode);
            if (isExtended) return new SelectExtendedCardBoxes(actualSetCode);
            return new SelectRegularCardBoxes(setCode);
        }

        private static SelectCardBoxes SelectTokenSproc(string setCode)
        {
            int indexOf = setCode.IndexOf("-", StringComparison.Ordinal);
            string actualSetCode = (indexOf == -1 ? setCode : setCode.Substring(0, indexOf)) + "-t";
            string lower = setCode.ToLower();
            bool isFoil = lower.Contains("-f");
            bool isExtended = lower.Contains("-e");

            if (isFoil && isExtended) return new SelectExtendedFoilCardBoxes(actualSetCode);
            if (isFoil) return new SelectFoilCardBoxes(actualSetCode);
            if (isExtended) return new SelectExtendedCardBoxes(actualSetCode);
            return new SelectRegularCardBoxes(actualSetCode);
        }
    }
}
