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
    public static class AzFuncArtistCardsCardBoxForUser
    {
        [FunctionName(nameof(AzFuncArtistCardsCardBoxForUser))]
        public static async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, Route = "v2/artist/{artistName}/cards/{userId}")] HttpRequest req, string artistName, string userId, ExecutionContext exCtx, ILogger log)
        {
            TraceLogger trace = new TraceLogger(log);
            log.LogInformation($"Request for [artistName={artistName}] cards for [userId={userId}]");
            trace.LifeTimeStart(exCtx);

            List<CardBoxInfo> result = await new SelectArtistCardVersionsCardBoxesForUser(artistName, userId).Execute(trace).NoSync();

            trace.LifeTimeEnd(exCtx);
            return new JsonResult(result);
        }
    }
    public static class AzFuncArtistCardsCardBox
    {
        [FunctionName(nameof(AzFuncArtistCardsCardBox))]
        public static async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, Route = "v2/artist/{artistName}/cards")] HttpRequest req, string artistName, ExecutionContext exCtx, ILogger log)
        {
            TraceLogger trace = new TraceLogger(log);
            log.LogInformation($"Request for [artistName={artistName}] cards");
            trace.LifeTimeStart(exCtx);

            List<CardBoxInfo> result = await new SelectArtistCardVersionsCardBoxes(artistName).Execute(trace).NoSync();

            trace.LifeTimeEnd(exCtx);
            return new JsonResult(result);
        }
    }
}