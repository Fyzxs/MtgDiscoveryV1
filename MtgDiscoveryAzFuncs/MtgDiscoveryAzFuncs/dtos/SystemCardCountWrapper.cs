using Newtonsoft.Json;

namespace MtgDiscoveryAzFuncs.dtos
{
    public class SystemCardCountWrapper
    {
        [JsonConstructor]
        public SystemCardCountWrapper( [JsonProperty("data")] SystemCardCountData data ) => Data = data;

        [JsonProperty("data")]
        public SystemCardCountData Data { get; }
    }
}