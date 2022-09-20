using System;
using System.Collections.Generic;

namespace MtgDiscoveryAzFuncs.dtos
{
    public class CardBoxInfoComparer : IEqualityComparer<CardBoxInfo>
    {
        public bool Equals(CardBoxInfo x, CardBoxInfo y)
        {
            if (ReferenceEquals(x, y)) return true;
            if (ReferenceEquals(x, null)) return false;
            if (ReferenceEquals(y, null)) return false;
            if (x.GetType() != y.GetType()) return false;
            return x.Uuid.Equals(y.Uuid) && 
                   x.IsExtendedCardSet == y.IsExtendedCardSet &&
                   x.IsForcedFoilSet == y.IsForcedFoilSet;
        }

        public int GetHashCode(CardBoxInfo obj)
        {
            HashCode hashCode = new HashCode();
            hashCode.Add(obj.Uuid);
            hashCode.Add(obj.IsExtendedCardSet);
            hashCode.Add(obj.IsForcedFoilSet);
            return hashCode.ToHashCode();
        }
    }
}