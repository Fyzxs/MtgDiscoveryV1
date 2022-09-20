using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using MtgDiscoveryAzFuncs.dtos;
using MtgDiscoveryAzFuncs.extensions;

namespace MtgDiscoveryAzFuncs.sprocs
{
    internal abstract class SelectSetBoxes
    {
        private enum Indexes
        {
            BaseSetSize = 0,
            Block,
            Code,
            ActualCode,
            ActualType,
            IsPartialPreview,
            KeyruneCode,
            Name,
            ParentCode,
            ReleaseDate,
            TotalSetSize,
            Type,
            CalculatedSetSize,
            OfSet,
            Collected
        }
        private readonly string _sprocName;

        protected SelectSetBoxes(string sprocName) => _sprocName = sprocName;

        protected abstract void ConfigureParameters(SqlParameterCollection sqlParameterCollection);

        public async Task<List<SetBoxInfo>> Execute(TraceLogger trace)
        {
            trace.MethodStart(nameof(Execute));

            await using SqlConnection connection = new SqlConnection(Environment.GetEnvironmentVariable("MtgSqlServer"));
            await using SqlCommand command = connection.CreateCommand();

            connection.Open();
            command.CommandText = $"[dbo].[{_sprocName}]";
            command.CommandType = CommandType.StoredProcedure;
            ConfigureParameters(command.Parameters);
            List<SetBoxInfo> collection = new List<SetBoxInfo>();
            SqlDataReader reader = await command.ExecuteReaderAsync().NoSync();
            while (reader.Read())
            {
                collection.Add(new SetBoxInfo(
                    baseSetSize: reader.GetInt32((int)Indexes.BaseSetSize),
                    block: reader.GetString((int)Indexes.Block),
                    code: reader.GetString((int)Indexes.Code),
                    actualCode: reader.GetString((int)Indexes.ActualCode),
                    actualType: reader.GetString((int)Indexes.ActualType),
                    isPartialPreview: reader.GetBoolean((int)Indexes.IsPartialPreview),
                    keyruneCode: reader.GetString((int)Indexes.KeyruneCode),
                    name: reader.GetString((int)Indexes.Name),
                    parentCode: reader.GetString((int)Indexes.ParentCode),
                    releaseDate: reader.GetDateTime((int)Indexes.ReleaseDate),
                    totalSetSize: reader.GetInt32((int)Indexes.TotalSetSize),
                    type: reader.GetString((int)Indexes.Type),
                    calculatedSetSize: reader.GetInt32((int)Indexes.CalculatedSetSize),
                    ofSet: reader.GetIntSafe((int)Indexes.OfSet),
                    collected: reader.GetIntSafe((int)Indexes.Collected)
                ));
            }

            trace.MethodEnd(nameof(Execute));
            return collection;
        }
    }
    
    internal sealed class SelectSetBoxInfo : SelectSetBoxes
    {
        private readonly string _setCode;
        public SelectSetBoxInfo(string setCode) : base("SelectSetBoxInfo") => _setCode = setCode;

        protected override void ConfigureParameters(SqlParameterCollection sqlParameterCollection)
        {
            sqlParameterCollection.AddWithValue("@SetCode", _setCode);
        }
    }

    internal sealed class SelectAllSetBoxInfos : SelectSetBoxes
    {
        public SelectAllSetBoxInfos() : base("SelectAllSets") { }

        protected override void ConfigureParameters(SqlParameterCollection sqlParameterCollection) { }
    }

    internal sealed class SelectAllSetBoxInfosForUser : SelectSetBoxes
    {
        private readonly Guid _userId;
        public SelectAllSetBoxInfosForUser(Guid userId) : base("SelectAllSetsForUser") => _userId = userId;

        protected override void ConfigureParameters(SqlParameterCollection sqlParameterCollection) => sqlParameterCollection.AddWithValue("@UserUuid", _userId);
    }
}