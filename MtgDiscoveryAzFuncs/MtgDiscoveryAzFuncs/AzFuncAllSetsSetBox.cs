using System.Collections.Generic;
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
    public static class AzFuncAllSetsSetBox
    {
        [FunctionName(nameof(AzFuncAllSetsSetBox))]
        public static async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, Route = "v2/sets")] HttpRequest req, ExecutionContext exCtx, ILogger log)
        {
            TraceLogger trace = new TraceLogger(log);
            trace.LifeTimeStart(exCtx);
            SelectSetBoxes sproc = new SelectAllSetBoxInfos();
            List<SetBoxInfo> result = await sproc.Execute(trace).NoSync();

            trace.LifeTimeEnd(exCtx);
            return new JsonResult(result);
        }
    }
}
