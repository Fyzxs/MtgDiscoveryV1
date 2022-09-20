using Newtonsoft.Json;

namespace MtgDiscoveryAzFuncs.dtos
{
    public class Prices
    {
        [JsonConstructor]
        public Prices(
            [JsonProperty("averageFoil")] decimal averageFoil,
            [JsonProperty("averageRegular")] decimal averageRegular,
            [JsonProperty("latestFoil")] decimal latestFoil,
            [JsonProperty("latestRegular")] decimal latestRegular
        )
        {
            this.AverageFoil = averageFoil;
            this.AverageRegular = averageRegular;
            this.LatestFoil = latestFoil;
            this.LatestRegular = latestRegular;
        }

        [JsonProperty("averageFoil")]
        public decimal AverageFoil { get; }

        [JsonProperty("averageRegular")]
        public decimal AverageRegular { get; }

        [JsonProperty("latestFoil")]
        public decimal LatestFoil { get; }

        [JsonProperty("latestRegular")]
        public decimal LatestRegular { get; }
    }
}