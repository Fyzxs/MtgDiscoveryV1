using System;
using System.Collections.Generic;

namespace MtgDiscoveryAzFuncs.dtos
{
    internal class SetBoxInfoComparer : IEqualityComparer<SetBoxInfo>
    {
        public bool Equals(SetBoxInfo x, SetBoxInfo y)
        {
            if (ReferenceEquals(x, y)) return true;
            if (ReferenceEquals(x, null)) return false;
            if (ReferenceEquals(y, null)) return false;
            if (x.GetType() != y.GetType()) return false;
            return x.Code == y.Code;
        }

        public int GetHashCode(SetBoxInfo obj) => obj.Code.GetHashCode();
    }
}