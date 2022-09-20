using System;
using Newtonsoft.Json;

namespace MtgDiscoveryAzFuncs.dtos
{
    public class SetBoxInfo
    {
        [JsonConstructor]
        public SetBoxInfo(
            [JsonProperty("baseSetSize")] int baseSetSize,
            [JsonProperty("block")] string block,
            [JsonProperty("code")] string code,
            [JsonProperty("actualCode")] string actualCode,
            [JsonProperty("keyruneCode")] string keyruneCode,
            [JsonProperty("name")] string name,
            [JsonProperty("parentCode")] string parentCode,
            [JsonProperty("releaseDate")] DateTime releaseDate,
            [JsonProperty("totalSetSize")] int totalSetSize,
            [JsonProperty("type")] string type,
            [JsonProperty("actualType")] string actualType,
            [JsonProperty("ofSet")] long ofSet,
            [JsonProperty("collected")] long collected,
            [JsonProperty("isPartialPreview")] bool isPartialPreview,
            [JsonProperty("calculatedSetSize")] int calculatedSetSize
        )
        {
            BaseSetSize = baseSetSize;
            Block = block;
            Code = code;
            ActualCode = actualCode;
            KeyruneCode = keyruneCode;
            Name = name;
            ParentCode = parentCode;
            ReleaseDate = releaseDate;
            TotalSetSize = totalSetSize;
            Type = type;
            ActualType = actualType;
            OfSet = ofSet;
            Collected = collected;
            IsPartialPreview = isPartialPreview;
            CalculatedSetSize = calculatedSetSize;
        }

        [JsonProperty("combineCode")]
        public string CombineCode => string.IsNullOrWhiteSpace(ParentCode) ? ActualCode : ParentCode;

        [JsonProperty("baseSetSize")]
        public int BaseSetSize { get; }

        [JsonProperty("block")]
        public string Block { get; }

        [JsonProperty("code")]
        public string Code { get; }

        [JsonProperty("actualCode")]
        public string ActualCode { get; }

        [JsonProperty("keyruneCode")]
        public string KeyruneCode { get; }

        [JsonProperty("name")]
        public string Name { get; }

        [JsonProperty("parentCode")]
        public string ParentCode { get; }

        [JsonProperty("releaseDate")]
        public DateTime ReleaseDate { get; }

        [JsonProperty("totalSetSize")]
        public int TotalSetSize { get; }

        [JsonProperty("type")]
        public string Type { get; }

        [JsonProperty("actualType")]
        public string ActualType { get; }

        [JsonProperty("ofSet")]
        public long OfSet { get; }

        [JsonProperty("collected")]
        public long Collected { get; }

        [JsonProperty("isPartialPreview")]
        public bool IsPartialPreview { get; }

        [JsonProperty("calculatedSetSize")]
        public int CalculatedSetSize { get; }
    }
}