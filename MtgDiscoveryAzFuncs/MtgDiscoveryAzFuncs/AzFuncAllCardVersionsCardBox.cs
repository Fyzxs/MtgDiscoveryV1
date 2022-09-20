using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using MtgDiscoveryAzFuncs.dtos;
using MtgDiscoveryAzFuncs.extensions;
using MtgDiscoveryAzFuncs.sprocs;

namespace MtgDiscoveryAzFuncs
{
    public static class AzFuncAllCardVersionsCardBox
    {
        [FunctionName(nameof(AzFuncAllCardVersionsCardBox))]
        public static async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, Route = "v2/card/{searchText}/cards")] HttpRequest req, string searchText, ExecutionContext exCtx, ILogger log)
        {
            TraceLogger trace = new TraceLogger(log);
            log.LogInformation($"Request for [searchText={searchText}] cards");
            trace.LifeTimeStart(exCtx);

            List<CardBoxInfo> result = await new SelectAllCardVersionsCardBoxes(searchText).Execute(trace).NoSync();

            trace.LifeTimeEnd(exCtx);
            return new JsonResult(result);
        }
    }
}