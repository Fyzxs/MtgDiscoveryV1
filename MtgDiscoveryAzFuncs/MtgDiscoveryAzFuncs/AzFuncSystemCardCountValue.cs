using System;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using MtgDiscoveryAzFuncs.dtos;
using MtgDiscoveryAzFuncs.extensions;

namespace MtgDiscoveryAzFuncs
{

    public static class AzFuncSystemCardCountValue
    {
        [FunctionName(nameof(AzFuncSystemCardCountValue))]
        public static async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, Route = "v2/collection/summary")] HttpRequest req, ExecutionContext exCtx, ILogger log)
        {
            TraceLogger trace = new TraceLogger(log);
            trace.LifeTimeStart(exCtx);
            int result = await ExecuteSproc(trace).NoSync();
            SystemCardCountWrapper systemCardCountWrapper = new SystemCardCountWrapper(new SystemCardCountData(result));
            trace.LifeTimeEnd(exCtx);
            return new JsonResult(systemCardCountWrapper);
        }

        private static async Task<int> ExecuteSproc(TraceLogger trace)
        {
            await using SqlConnection connection = new SqlConnection(Environment.GetEnvironmentVariable("MtgSqlServer"));
            await using SqlCommand command = connection.CreateCommand();

            connection.Open();
            command.CommandText = "[dbo].[SystemCardCount]";
            command.CommandType = CommandType.StoredProcedure;
            trace.MethodStart(nameof(ExecuteSproc));
            object scalarResult = await command.ExecuteScalarAsync().NoSync();
            trace.MethodEnd(nameof(ExecuteSproc));
            return scalarResult is int result ? result : 0;
        }
    }
}
