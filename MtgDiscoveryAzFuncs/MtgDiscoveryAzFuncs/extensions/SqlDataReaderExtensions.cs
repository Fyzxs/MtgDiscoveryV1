using System.Data.SqlClient;

namespace MtgDiscoveryAzFuncs.extensions
{
    internal static class SqlDataReaderExtensions
    {
        public static decimal GetDecimalSafe(this SqlDataReader reader, int ordinal, decimal @default = default)
        {
            if (reader.FieldCount < ordinal + 1) return @default;
            if (reader.IsDBNull(ordinal)) return @default;

            return reader.GetDecimal(ordinal);
        }

        public static long GetIntSafe(this SqlDataReader reader, int ordinal, long @default = default)
        {
            if (reader.FieldCount < ordinal + 1) return @default;
            if (reader.IsDBNull(ordinal)) return @default;
            if (reader.GetDataTypeName(ordinal) == "int") return reader.GetInt32(ordinal);//reader.GetIntSafe(ordinal);

            return reader.GetInt64(ordinal);
        }
        //private static int GetInt32Safe(this SqlDataReader reader, int ordinal, int @default = default)
        //{
        //    if (reader.FieldCount < ordinal + 1) return @default;
        //    if (reader.IsDBNull(ordinal)) return @default;

        //    return reader.GetInt32(ordinal);
        //}
    }
}