using System.Diagnostics;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;

namespace MtgDiscoveryAzFuncs
{
    internal class TraceLogger
    {
        private readonly ILogger _log;
        private readonly Stopwatch _swLifeTime = new Stopwatch();
        private readonly Stopwatch _swMethod = new Stopwatch();
        private string _lifeTime;

        public TraceLogger(ILogger log) => _log = log;

        public void Log(string msg) => _log.LogInformation(msg);

        public void LifeTimeStart(ExecutionContext exCtx)
        {
            _lifeTime = exCtx.FunctionName;
            Start(exCtx.FunctionName, _swLifeTime);
        }

        public void LifeTimeEnd(ExecutionContext exCtx) => End(exCtx.FunctionName, _swLifeTime);
        public void MethodStart(string methodName) => Start(methodName, _swMethod);
        public void MethodEnd(string methodName) => End(methodName, _swMethod);
        
        private void Start(string name, Stopwatch sw)
        {
            _log.LogInformation($"{_lifeTime}:{name} invoked");
            sw.Start();
        }
        private void End(string name, Stopwatch sw)
        {
            sw.Stop();
            _log.LogInformation($"{_lifeTime}:{name} exiting [runtime={_swMethod.ElapsedMilliseconds}ms]");
        }
    }
}