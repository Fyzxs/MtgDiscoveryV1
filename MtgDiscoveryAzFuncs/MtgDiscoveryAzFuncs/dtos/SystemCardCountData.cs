using Newtonsoft.Json;

namespace MtgDiscoveryAzFuncs.dtos
{
    public class SystemCardCountData
    {
        [JsonConstructor]
        public SystemCardCountData([JsonProperty("totalCardCount")] int totalCardCount ) => TotalCardCount = totalCardCount;

        [JsonProperty("totalCardCount")]
        public int TotalCardCount { get; }
    }
}