using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using MtgDiscoveryAzFuncs.dtos;
using MtgDiscoveryAzFuncs.extensions;

namespace MtgDiscoveryAzFuncs.sprocs
{
    internal abstract class SelectCardBoxes
    {
        private enum Indexes
        {
            CardArtist = 0,
            CardName,
            CardRarity,
            CardSetCode,
            CardKeyRuneCode,
            CardNumber,
            CardFaceName,
            CardUuid,
            CardHasFoil,
            CardHasNonFoil,
            CardIsPromo,
            CardSide,
            CardIsExtendedSetCard,
            CardIsForcedFoilSet,
            CardSetType,
            CardLayout,
            IdentifiersScryfallId,
            IdentifiersMultiverseId,
            IdentifiersCardKingdomId,
            IdentifiersCardKingdomFoilId,
            CardPriceInfoAverageFoil,
            CardPriceInfoAverageRegular,
            CardPriceInfoLatestFoil,
            CardPriceInfoLatestRegular,
            CardSetName,
            CardSetReleaseDate,
            NonFoilCount,
            FoilCount
        }

        private readonly string _sprocName;

        protected SelectCardBoxes(string sprocName) => _sprocName = sprocName;

        protected abstract void ConfigureParameters(SqlParameterCollection sqlParameterCollection);

        public async Task<List<CardBoxInfo>> Execute(TraceLogger trace)
        {
            trace.MethodStart(nameof(Execute));

            await using SqlConnection connection =
                new SqlConnection(Environment.GetEnvironmentVariable("MtgSqlServer"));
            await using SqlCommand command = connection.CreateCommand();

            connection.Open();
            command.CommandText = $"[dbo].[{_sprocName}]";
            command.CommandType = CommandType.StoredProcedure;
            ConfigureParameters(command.Parameters);
            List<CardBoxInfo> collection = new List<CardBoxInfo>();
            SqlDataReader reader = await command.ExecuteReaderAsync().NoSync();
            while (reader.Read())
            {
                collection.Add(new CardBoxInfo(
                    artist: reader.GetString((int) Indexes.CardArtist),
                    name: reader.GetString((int) Indexes.CardName),
                    rarity: reader.GetString((int) Indexes.CardRarity),
                    setCode: reader.GetString((int) Indexes.CardSetCode),
                    keyRuneCode: reader.GetString((int) Indexes.CardKeyRuneCode),
                    number: reader.GetString((int) Indexes.CardNumber),
                    faceName: reader.GetString((int) Indexes.CardFaceName),
                    uuid: reader.GetGuid((int) Indexes.CardUuid),
                    hasFoil: reader.GetBoolean((int) Indexes.CardHasFoil),
                    hasNonFoil: reader.GetBoolean((int) Indexes.CardHasNonFoil),
                    isPromo: reader.GetBoolean((int) Indexes.CardIsPromo),
                    identifiers: new Identifiers(
                        reader.GetString((int) Indexes.IdentifiersScryfallId),
                        reader.GetString((int) Indexes.IdentifiersMultiverseId),
                        reader.GetString((int) Indexes.IdentifiersCardKingdomId),
                        reader.GetString((int) Indexes.IdentifiersCardKingdomFoilId)
                    ),
                    side: reader.GetString((int) Indexes.CardSide),
                    isExtendedCardSet: reader.GetBoolean((int) Indexes.CardIsExtendedSetCard),
                    isForcedFoilSet: reader.GetBoolean((int) Indexes.CardIsForcedFoilSet),
                    setType: reader.GetString((int) Indexes.CardSetType),
                    layout: reader.GetString((int) Indexes.CardLayout),
                    prices: new Prices(
                        reader.GetDecimalSafe((int) Indexes.CardPriceInfoAverageFoil),
                        reader.GetDecimalSafe((int) Indexes.CardPriceInfoAverageRegular),
                        reader.GetDecimalSafe((int) Indexes.CardPriceInfoLatestFoil),
                        reader.GetDecimalSafe((int) Indexes.CardPriceInfoLatestRegular)
                    ),
                    setName: reader.GetString((int) Indexes.CardSetName),
                    setReleaseDate: reader.GetDateTime((int) Indexes.CardSetReleaseDate),
                    countNonFoil: reader.GetIntSafe((int)Indexes.NonFoilCount),
                    countFoil: reader.GetIntSafe((int)Indexes.FoilCount)
                ));
            }

            trace.MethodEnd(nameof(Execute));
            return collection;
        }
    }

    internal sealed class SelectExtendedFoilCardBoxes : SelectCardBoxes
    {
        private readonly string _setCode;

        public SelectExtendedFoilCardBoxes(string setCode) : base("SelectExtendedFoilSetCards") => _setCode = setCode;

        protected override void ConfigureParameters(SqlParameterCollection sqlParameterCollection) =>
            sqlParameterCollection.AddWithValue("@SetCode", _setCode);
    }

    internal sealed class SelectFoilCardBoxes : SelectCardBoxes
    {
        private readonly string _setCode;

        public SelectFoilCardBoxes(string setCode) : base("SelectFoilSetCards") => _setCode = setCode;

        protected override void ConfigureParameters(SqlParameterCollection sqlParameterCollection) =>
            sqlParameterCollection.AddWithValue("@SetCode", _setCode);
    }

    internal sealed class SelectExtendedCardBoxes : SelectCardBoxes
    {
        private readonly string _setCode;

        public SelectExtendedCardBoxes(string setCode) : base("SelectExtendedSetCards") => _setCode = setCode;

        protected override void ConfigureParameters(SqlParameterCollection sqlParameterCollection) =>
            sqlParameterCollection.AddWithValue("@SetCode", _setCode);
    }

    internal sealed class SelectRegularCardBoxes : SelectCardBoxes
    {
        private readonly string _setCode;

        public SelectRegularCardBoxes(string setCode) : base("SelectRegularSetCards") => _setCode = setCode;

        protected override void ConfigureParameters(SqlParameterCollection sqlParameterCollection) =>
            sqlParameterCollection.AddWithValue("@SetCode", _setCode);
    }

    internal sealed class SelectRegularCardBoxesForUser : SelectCardBoxes
    {
        private readonly string _setCode;
        private readonly string _userId;

        public SelectRegularCardBoxesForUser(string setCode, string userId) : base("SelectRegularSetCardsForUser")
        {
            _setCode = setCode;
            _userId = userId;
        }

        protected override void ConfigureParameters(SqlParameterCollection sqlParameterCollection)
        {
            sqlParameterCollection.AddWithValue("@SetCode", _setCode);
            sqlParameterCollection.AddWithValue("@UserUuid", _userId);
        }
    }
    internal sealed class SelectExtendedFoilCardBoxesForUser : SelectCardBoxes
    {
        private readonly string _setCode;
        private readonly string _userId;

        public SelectExtendedFoilCardBoxesForUser(string setCode, string userId) : base("SelectExtendedFoilSetCardsForUser")
        {
            _setCode = setCode;
            _userId = userId;
        }

        protected override void ConfigureParameters(SqlParameterCollection sqlParameterCollection)
        {
            sqlParameterCollection.AddWithValue("@SetCode", _setCode);
            sqlParameterCollection.AddWithValue("@UserUuid", _userId);
        }
    }
    internal sealed class SelectArtistCardVersionsCardBoxesForUser : SelectCardBoxes
    {
        private readonly string _artistName;
        private readonly string _userId;

        public SelectArtistCardVersionsCardBoxesForUser(string artistName, string userId) : base("SelectArtistCardsForUser")
        {
            _artistName = artistName;
            _userId = userId;
        }

        protected override void ConfigureParameters(SqlParameterCollection sqlParameterCollection)
        {
            sqlParameterCollection.AddWithValue("@ArtistName", _artistName);
            sqlParameterCollection.AddWithValue("@UserUuid", _userId);
        }
    }
    internal sealed class SelectArtistCardVersionsCardBoxes : SelectCardBoxes
    {
        private readonly string _artistName;

        public SelectArtistCardVersionsCardBoxes(string artistName) : base("SelectArtistCards")
        {
            _artistName = artistName;
        }

        protected override void ConfigureParameters(SqlParameterCollection sqlParameterCollection)
        {
            sqlParameterCollection.AddWithValue("@ArtistName", _artistName);
        }
    }
    internal sealed class SelectExtendedCardBoxesForUser : SelectCardBoxes
    {
        private readonly string _setCode;
        private readonly string _userId;

        public SelectExtendedCardBoxesForUser(string setCode, string userId) : base("SelectExtendedSetCardsForUser")
        {
            _setCode = setCode;
            _userId = userId;
        }

        protected override void ConfigureParameters(SqlParameterCollection sqlParameterCollection)
        {
            sqlParameterCollection.AddWithValue("@SetCode", _setCode);
            sqlParameterCollection.AddWithValue("@UserUuid", _userId);
        }
    }
    internal sealed class SelectFoilCardBoxesForUser : SelectCardBoxes
    {
        private readonly string _setCode;
        private readonly string _userId;

        public SelectFoilCardBoxesForUser(string setCode, string userId) : base("SelectFoilSetCardsForUser")
        {
            _setCode = setCode;
            _userId = userId;
        }

        protected override void ConfigureParameters(SqlParameterCollection sqlParameterCollection)
        {
            sqlParameterCollection.AddWithValue("@SetCode", _setCode);
            sqlParameterCollection.AddWithValue("@UserUuid", _userId);
        }
    }

    internal sealed class SelectAllCardVersionsCardBoxes : SelectCardBoxes
    {
        private readonly string _searchText;

        public SelectAllCardVersionsCardBoxes(string searchText) : base("SelectAllCardsOfVersion") => _searchText = searchText;

        protected override void ConfigureParameters(SqlParameterCollection sqlParameterCollection) =>
            sqlParameterCollection.AddWithValue("@CardName", _searchText);
    }
}
