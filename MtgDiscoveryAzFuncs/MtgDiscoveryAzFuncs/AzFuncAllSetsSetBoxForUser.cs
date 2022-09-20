using System;
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
    public static class AzFuncAllSetsSetBoxForUser
    {
        [FunctionName(nameof(AzFuncAllSetsSetBoxForUser))]
        public static async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, Route = "v2/sets/{userId}")] HttpRequest req, Guid userId, ExecutionContext exCtx, ILogger log)
        {
            TraceLogger trace = new TraceLogger(log);
            trace.LifeTimeStart(exCtx);
            SelectSetBoxes sproc = new SelectAllSetBoxInfosForUser(userId);
            List<SetBoxInfo> result = await sproc.Execute(trace).NoSync();

            trace.LifeTimeEnd(exCtx);
            return new JsonResult(result);
        }
    }
}