using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace MtgDiscoveryAzFuncs
{
    public static class HealthCheck
    {
        [FunctionName("HealthCheck")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "health")] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("Health Check");

            return new OkResult();
        }
    }
}
