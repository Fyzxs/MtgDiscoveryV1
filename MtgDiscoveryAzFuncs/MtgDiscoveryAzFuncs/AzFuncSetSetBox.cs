using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using MtgDiscoveryAzFuncs.dtos;
using MtgDiscoveryAzFuncs.extensions;
using MtgDiscoveryAzFuncs.sprocs;

namespace MtgDiscoveryAzFuncs
{
    public static class AzFuncSetSetBox
    {
        [FunctionName(nameof(AzFuncSetSetBox))]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, Route = "v2/set/{setCodes}")] HttpRequest req, string setCodes, ExecutionContext exCtx, ILogger log)
        {
            TraceLogger trace = new TraceLogger(log);
            trace.LifeTimeStart(exCtx);

            //HashSet<SetBoxInfo> collectionSet = new HashSet<SetBoxInfo>(new SetBoxInfoComparer());
            //foreach (string set in setCodes.Split(","))
            //{
            //    foreach (SetBoxInfo setBox in await new SelectSetBoxInfo(set).Execute(trace).NoSync())
            //    {
            //        collectionSet.Add(setBox);
            //    }
            //}

            HashSet<SetBoxInfo> collectionSet = new HashSet<SetBoxInfo>(new SetBoxInfoComparer());
            string[] setCodeArray = setCodes.Split(",");
            Task<List<SetBoxInfo>>[] taskCollection = new Task<List<SetBoxInfo>>[setCodeArray.Length];

            for (int setIndex = 0; setIndex < setCodeArray.Length; setIndex++)
            {
                taskCollection[setIndex] = new SelectSetBoxInfo(setCodeArray[setIndex]).Execute(trace);
            }

            Task.WaitAll(taskCollection);

            for (int setIndex = 0; setIndex < setCodeArray.Length; setIndex++)
            {
                foreach (SetBoxInfo setBox in (await taskCollection[setIndex]))
                {
                    collectionSet.Add(setBox);
                }
            }

            trace.LifeTimeEnd(exCtx);
            return new JsonResult(collectionSet);
        }
    }
}
