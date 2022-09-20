using System;
using Newtonsoft.Json;

namespace MtgDiscoveryAzFuncs.dtos
{
    public class CardBoxInfo
    {
        [JsonConstructor]
        public CardBoxInfo(
            [JsonProperty("artist")] string artist,
            [JsonProperty("uuid")] Guid uuid,
            [JsonProperty("name")] string name,
            [JsonProperty("rarity")] string rarity,
            [JsonProperty("setCode")] string setCode,
            [JsonProperty("keyRuneCode")] string keyRuneCode,
            [JsonProperty("faceName")] string faceName,
            [JsonProperty("number")] string number,
            [JsonProperty("isPromo")] bool isPromo,
            [JsonProperty("hasFoil")] bool hasFoil,
            [JsonProperty("hasNonFoil")] bool hasNonFoil,
            [JsonProperty("identifiers")] Identifiers identifiers,
            [JsonProperty("side")] string side,
            [JsonProperty("isExtendedCardSet")] bool isExtendedCardSet,
            [JsonProperty("isForcedFoilSet")] bool isForcedFoilSet,
            [JsonProperty("countNonFoil")] long countNonFoil,
            [JsonProperty("countFoil")] long countFoil,
            [JsonProperty("layout")] string layout,
            [JsonProperty("setType")] string setType,
            [JsonProperty("setName")] string setName,
            [JsonProperty("setReleaseDate")] DateTime setReleaseDate,
            [JsonProperty("prices")] Prices prices
        )
        {
            this.Artist = artist;
            this.Uuid = uuid;
            this.Name = name;
            this.Rarity = rarity;
            this.SetCode = setCode;
            this.KeyRuneCode = keyRuneCode;
            this.FaceName = faceName;
            this.Number = number;
            this.IsPromo = isPromo;
            this.HasFoil = hasFoil;
            this.HasNonFoil = hasNonFoil;
            this.Identifiers = identifiers;
            this.Side = side;
            this.IsExtendedCardSet = isExtendedCardSet;
            this.IsForcedFoilSet = isForcedFoilSet;
            this.CountNonFoil = countNonFoil;
            this.CountFoil = countFoil;
            this.Layout = layout;
            this.SetType = setType;
            this.SetName = setName;
            this.SetReleaseDate = setReleaseDate;
            this.Prices = prices;
        }

        [JsonProperty("artist")]
        public string Artist { get; }

        [JsonProperty("uuid")]
        public Guid Uuid { get; }

        [JsonProperty("name")]
        public string Name { get; }

        [JsonProperty("rarity")]
        public string Rarity { get; }

        [JsonProperty("setCode")]
        public string SetCode { get; }

        [JsonProperty("keyRuneCode")]
        public string KeyRuneCode { get; }

        [JsonProperty("faceName")]
        public string FaceName { get; }

        [JsonProperty("number")]
        public string Number { get; }

        [JsonProperty("isPromo")]
        public bool IsPromo { get; }

        [JsonProperty("hasFoil")]
        public bool HasFoil { get; }

        [JsonProperty("hasNonFoil")]
        public bool HasNonFoil { get; }

        [JsonProperty("identifiers")]
        public Identifiers Identifiers { get; }

        [JsonProperty("side")]
        public string Side { get; }

        [JsonProperty("isExtendedCardSet")]
        public bool IsExtendedCardSet { get; }

        [JsonProperty("isForcedFoilSet")]
        public bool IsForcedFoilSet { get; }

        [JsonProperty("countNonFoil")]
        public long CountNonFoil { get; }

        [JsonProperty("countFoil")]
        public long CountFoil { get; }

        [JsonProperty("layout")]
        public string Layout { get; }

        [JsonProperty("setType")]
        public string SetType { get; }

        [JsonProperty("setName")]
        public string SetName { get; }

        [JsonProperty("setReleaseDate")]
        public DateTime SetReleaseDate { get; }

        [JsonProperty("prices")]
        public Prices Prices { get; }
    }
}