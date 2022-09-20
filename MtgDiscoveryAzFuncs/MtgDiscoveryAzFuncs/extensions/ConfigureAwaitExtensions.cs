using System.Runtime.CompilerServices;
using System.Threading.Tasks;

namespace MtgDiscoveryAzFuncs.extensions
{
    internal static class ConfigureAwaitExtensions
    {
        internal static ConfiguredTaskAwaitable NoSync(this Task t) => t.ConfigureAwait(false);
        internal static ConfiguredTaskAwaitable<T> NoSync<T>(this Task<T> t) => t.ConfigureAwait(false);
        internal static ConfiguredValueTaskAwaitable NoSync(this ValueTask vt) => vt.ConfigureAwait(false);
        internal static ConfiguredValueTaskAwaitable<T> NoSync<T>(this ValueTask<T> vt) => vt.ConfigureAwait(false);
    }
}