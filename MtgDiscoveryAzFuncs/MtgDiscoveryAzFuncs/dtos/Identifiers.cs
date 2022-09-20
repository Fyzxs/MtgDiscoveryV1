using Newtonsoft.Json;

namespace MtgDiscoveryAzFuncs.dtos
{
    public class Identifiers
    {
        [JsonConstructor]
        public Identifiers(
            [JsonProperty("scryfallId")] string scryfallId,
            [JsonProperty("multiverseId")] string multiverseId,
            [JsonProperty("cardKingdomId")] string cardKingdomId,
            [JsonProperty("cardKingdomFoilId")] string cardKingdomFoilId
        )
        {
            this.ScryfallId = scryfallId;
            this.MultiverseId = multiverseId;
            this.CardKingdomId = cardKingdomId;
            this.CardKingdomFoilId = cardKingdomFoilId;
        }

        [JsonProperty("scryfallId")]
        public string ScryfallId { get; }

        [JsonProperty("multiverseId")]
        public string MultiverseId { get; }

        [JsonProperty("cardKingdomId")]
        public string CardKingdomId { get; }

        [JsonProperty("cardKingdomFoilId")]
        public string CardKingdomFoilId { get; }
    }
}