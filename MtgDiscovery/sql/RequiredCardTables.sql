IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[CardSet_Excluded]') AND type in (N'U'))
DROP TABLE [dbo].[CardSet_Excluded]
CREATE TABLE [dbo].[CardSet_Excluded](
    [id] [int] IDENTITY(1,1) NOT NULL
    , [actualCode] [nvarchar](max) NOT NULL
    , [actualType] [nvarchar](max) NOT NULL
    , [actualname] [nvarchar](64) NOT NULL
    , [baseSetSize] [int] NOT NULL
    , [block] [nvarchar](64) NOT NULL
    , [calculatedSetSize] [int] NOT NULL
    , [code] [nvarchar](64) NOT NULL
    , [codeV3] [nvarchar](max) NOT NULL
    , [isFoilOnly] [bit] NOT NULL
    , [isForcedExtendedSet] [bit] NOT NULL
    , [isForcedFoilSet] [bit] NOT NULL
    , [isForcedTokenSet] [bit] NOT NULL
    , [isForeignOnly] [bit] NOT NULL
    , [isNonFoilOnly] [bit] NOT NULL
    , [isOnlineOnly] [bit] NOT NULL
    , [isPaperOnly] [bit] NOT NULL
    , [isPartialPreview] [bit] NOT NULL
    , [keyruneCode] [nvarchar](max) NOT NULL
    , [mcmId] [int] NOT NULL
    , [mcmName] [nvarchar](max) NOT NULL
    , [mtgoCode] [nvarchar](max) NOT NULL
    , [name] [nvarchar](256) NOT NULL
    , [parentCode] [nvarchar](max) NOT NULL
    , [releaseDate] [datetime2](7) NOT NULL
    , [srcBaseSetSize] [int] NOT NULL
    , [totalSetSize] [int] NOT NULL
    , [type] [nvarchar](128) NOT NULL
    ) ON [PRIMARY]
--------
    IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[CardSet]') AND type in (N'U'))
DROP TABLE [dbo].[CardSet]
CREATE TABLE [dbo].[CardSet](
    [id] [int] IDENTITY(1,1) NOT NULL
    , [actualCode] [nvarchar](max) NOT NULL
    , [actualType] [nvarchar](max) NOT NULL
    , [actualname] [nvarchar](64) NOT NULL
    , [baseSetSize] [int] NOT NULL
    , [block] [nvarchar](64) NOT NULL
    , [calculatedSetSize] [int] NOT NULL
    , [code] [nvarchar](64) NOT NULL
    , [codeV3] [nvarchar](max) NOT NULL
    , [isFoilOnly] [bit] NOT NULL
    , [isForcedExtendedSet] [bit] NOT NULL
    , [isForcedFoilSet] [bit] NOT NULL
    , [isForcedTokenSet] [bit] NOT NULL
    , [isForeignOnly] [bit] NOT NULL
    , [isNonFoilOnly] [bit] NOT NULL
    , [isOnlineOnly] [bit] NOT NULL
    , [isPaperOnly] [bit] NOT NULL
    , [isPartialPreview] [bit] NOT NULL
    , [keyruneCode] [nvarchar](max) NOT NULL
    , [mcmId] [int] NOT NULL
    , [mcmName] [nvarchar](max) NOT NULL
    , [mtgoCode] [nvarchar](max) NOT NULL
    , [name] [nvarchar](256) NOT NULL
    , [parentCode] [nvarchar](max) NOT NULL
    , [releaseDate] [datetime2](7) NOT NULL
    , [srcBaseSetSize] [int] NOT NULL
    , [totalSetSize] [int] NOT NULL
    , [type] [nvarchar](128) NOT NULL
    ) ON [PRIMARY]
--------
    IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Card_Excluded]') AND type in (N'U'))
DROP TABLE [dbo].[Card_Excluded]
CREATE TABLE [dbo].[Card_Excluded](
    [id] [int] IDENTITY(1,1) NOT NULL
    , [artist] [nvarchar](128) NOT NULL
    , [asciiName] [nvarchar](256) NOT NULL
    , [borderColor] [nvarchar](max) NOT NULL
    , [convertedManaCost] [decimal] NOT NULL
    , [duelDeck] [nvarchar](max) NOT NULL
    , [faceConvertedManaCost] [decimal] NOT NULL
    , [faceName] [nvarchar](max) NOT NULL
    , [flavorText] [nvarchar](512) NOT NULL
    , [frameVersion] [nvarchar](max) NOT NULL
    , [hand] [nvarchar](64) NOT NULL
    , [hasAlternativeDeckLimit] [bit] NOT NULL
    , [hasContentWarning] [bit] NOT NULL
    , [hasFoil] [bit] NOT NULL
    , [hasNonFoil] [bit] NOT NULL
    , [hasOtherFaceIds] [bit] NOT NULL
    , [isAlternative] [bit] NOT NULL
    , [isExtendedSetCard] [bit] NOT NULL
    , [isForcedFoilSet] [bit] NOT NULL
    , [isFullArt] [bit] NOT NULL
    , [isOnlineOnly] [bit] NOT NULL
    , [isOversized] [bit] NOT NULL
    , [isPromo] [bit] NOT NULL
    , [isReprint] [bit] NOT NULL
    , [isReserved] [bit] NOT NULL
    , [isStarter] [bit] NOT NULL
    , [isStorySpotlight] [bit] NOT NULL
    , [isTextless] [bit] NOT NULL
    , [isTimeshifted] [bit] NOT NULL
    , [keyruneCode] [nvarchar](max) NOT NULL
    , [layout] [nvarchar](64) NOT NULL
    , [life] [nvarchar](64) NOT NULL
    , [loyalty] [nvarchar](64) NOT NULL
    , [manaCost] [nvarchar](128) NOT NULL
    , [name] [nvarchar](256) NOT NULL
    , [number] [nvarchar](64) NOT NULL
    , [originalText] [nvarchar](1024) NOT NULL
    , [originalType] [nvarchar](128) NOT NULL
    , [power] [nvarchar](max) NOT NULL
    , [rarity] [nvarchar](64) NOT NULL
    , [setCode] [nvarchar](max) NOT NULL
    , [setType] [nvarchar](max) NOT NULL
    , [side] [nvarchar](max) NOT NULL
    , [text] [nvarchar](1024) NOT NULL
    , [toughness] [nvarchar](64) NOT NULL
    , [type] [nvarchar](128) NOT NULL
    , [uuid] [uniqueidentifier] NOT NULL
    , [watermark] [nvarchar](64) NOT NULL
    ) ON [PRIMARY]
--------
    IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Card]') AND type in (N'U'))
DROP TABLE [dbo].[Card]
CREATE TABLE [dbo].[Card](
    [id] [int] IDENTITY(1,1) NOT NULL
    , [artist] [nvarchar](128) NOT NULL
    , [asciiName] [nvarchar](256) NOT NULL
    , [borderColor] [nvarchar](max) NOT NULL
    , [convertedManaCost] [decimal] NOT NULL
    , [duelDeck] [nvarchar](max) NOT NULL
    , [faceConvertedManaCost] [decimal] NOT NULL
    , [faceName] [nvarchar](max) NOT NULL
    , [flavorText] [nvarchar](512) NOT NULL
    , [frameVersion] [nvarchar](max) NOT NULL
    , [hand] [nvarchar](64) NOT NULL
    , [hasAlternativeDeckLimit] [bit] NOT NULL
    , [hasContentWarning] [bit] NOT NULL
    , [hasFoil] [bit] NOT NULL
    , [hasNonFoil] [bit] NOT NULL
    , [hasOtherFaceIds] [bit] NOT NULL
    , [isAlternative] [bit] NOT NULL
    , [isExtendedSetCard] [bit] NOT NULL
    , [isForcedFoilSet] [bit] NOT NULL
    , [isFullArt] [bit] NOT NULL
    , [isOnlineOnly] [bit] NOT NULL
    , [isOversized] [bit] NOT NULL
    , [isPromo] [bit] NOT NULL
    , [isReprint] [bit] NOT NULL
    , [isReserved] [bit] NOT NULL
    , [isStarter] [bit] NOT NULL
    , [isStorySpotlight] [bit] NOT NULL
    , [isTextless] [bit] NOT NULL
    , [isTimeshifted] [bit] NOT NULL
    , [keyruneCode] [nvarchar](max) NOT NULL
    , [layout] [nvarchar](64) NOT NULL
    , [life] [nvarchar](64) NOT NULL
    , [loyalty] [nvarchar](64) NOT NULL
    , [manaCost] [nvarchar](128) NOT NULL
    , [name] [nvarchar](256) NOT NULL
    , [number] [nvarchar](64) NOT NULL
    , [originalText] [nvarchar](1024) NOT NULL
    , [originalType] [nvarchar](128) NOT NULL
    , [power] [nvarchar](max) NOT NULL
    , [rarity] [nvarchar](64) NOT NULL
    , [setCode] [nvarchar](max) NOT NULL
    , [setType] [nvarchar](max) NOT NULL
    , [side] [nvarchar](max) NOT NULL
    , [text] [nvarchar](1024) NOT NULL
    , [toughness] [nvarchar](64) NOT NULL
    , [type] [nvarchar](128) NOT NULL
    , [uuid] [uniqueidentifier] NOT NULL
    , [watermark] [nvarchar](64) NOT NULL
    ) ON [PRIMARY]
--------
    IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[CardPurchaseUrls]') AND type in (N'U'))
DROP TABLE [dbo].[CardPurchaseUrls]
CREATE TABLE [dbo].[CardPurchaseUrls](
    [id] [int] IDENTITY(1,1) NOT NULL
    , [cardId] [uniqueidentifier] NOT NULL
    , [cardKingdom] [nvarchar](max) NOT NULL
    , [cardKingdomFoil] [nvarchar](max) NOT NULL
    , [cardmarket] [nvarchar](max) NOT NULL
    , [tcgplayer] [nvarchar](max) NOT NULL
    ) ON [PRIMARY]
--------
    IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Identifiers]') AND type in (N'U'))
DROP TABLE [dbo].[Identifiers]
CREATE TABLE [dbo].[Identifiers](
    [id] [int] IDENTITY(1,1) NOT NULL
    , [cardId] [uniqueidentifier] NOT NULL
    , [cardKingdomFoilId] [nvarchar](max) NOT NULL
    , [cardKingdomId] [nvarchar](max) NOT NULL
    , [mcmId] [nvarchar](max) NOT NULL
    , [mcmMetaId] [nvarchar](max) NOT NULL
    , [mtgArenaId] [nvarchar](max) NOT NULL
    , [mtgjsonV4Id] [nvarchar](max) NOT NULL
    , [mtgoFoilId] [nvarchar](max) NOT NULL
    , [mtgoId] [nvarchar](max) NOT NULL
    , [multiverseId] [nvarchar](max) NOT NULL
    , [scryfallId] [nvarchar](max) NOT NULL
    , [scryfallIllustrationId] [nvarchar](max) NOT NULL
    , [scryfallOracleId] [nvarchar](max) NOT NULL
    , [tcgplayerProductId] [nvarchar](max) NOT NULL
    ) ON [PRIMARY]
--------
    IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[CardSupertypes]') AND type in (N'U'))
DROP TABLE [dbo].[CardSupertypes]
CREATE TABLE [dbo].[CardSupertypes](
    [id] [int] IDENTITY(1,1) NOT NULL
    , [cardId] [uniqueidentifier] NOT NULL
    , [data] [nvarchar](max) NOT NULL
    ) ON [PRIMARY]
--------