
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[CardForeignDatum]') AND type in (N'U'))
DROP TABLE [dbo].[CardForeignDatum]
CREATE TABLE [dbo].[CardForeignDatum](
    [id] [int] IDENTITY(1,1) NOT NULL
    , [cardId] [uniqueidentifier] NOT NULL
    , [faceName] [nvarchar](max) NOT NULL
    , [flavorText] [nvarchar](512) NOT NULL
    , [language] [nvarchar](max) NOT NULL
    , [multiverseId] [nvarchar](max) NOT NULL
    , [name] [nvarchar](256) NOT NULL
    , [text] [nvarchar](1024) NOT NULL
    , [type] [nvarchar](128) NOT NULL
    ) ON [PRIMARY]
--------
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[CardForeignData]') AND type in (N'U'))
DROP TABLE [dbo].[CardForeignData]
CREATE TABLE [dbo].[CardForeignData](
    [id] [int] IDENTITY(1,1) NOT NULL
    , [cardId] [uniqueidentifier] NOT NULL
    , [data] [nvarchar](max) NOT NULL
    ) ON [PRIMARY]
--------
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[CardOtherFaceIds]') AND type in (N'U'))
DROP TABLE [dbo].[CardOtherFaceIds]
CREATE TABLE [dbo].[CardOtherFaceIds](
    [id] [int] IDENTITY(1,1) NOT NULL
    , [cardId] [uniqueidentifier] NOT NULL
    , [data] [nvarchar](max) NOT NULL
    ) ON [PRIMARY]
--------
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[CardTypes]') AND type in (N'U'))
DROP TABLE [dbo].[CardTypes]
CREATE TABLE [dbo].[CardTypes](
    [id] [int] IDENTITY(1,1) NOT NULL
    , [cardId] [uniqueidentifier] NOT NULL
    , [data] [nvarchar](max) NOT NULL
    ) ON [PRIMARY]
--------
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[CardSubtypes]') AND type in (N'U'))
DROP TABLE [dbo].[CardSubtypes]
CREATE TABLE [dbo].[CardSubtypes](
    [id] [int] IDENTITY(1,1) NOT NULL
    , [cardId] [uniqueidentifier] NOT NULL
    , [data] [nvarchar](max) NOT NULL
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
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[CardPrintings]') AND type in (N'U'))
DROP TABLE [dbo].[CardPrintings]
CREATE TABLE [dbo].[CardPrintings](
    [id] [int] IDENTITY(1,1) NOT NULL
    , [cardId] [uniqueidentifier] NOT NULL
    , [data] [nvarchar](max) NOT NULL
    ) ON [PRIMARY]
--------
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ReverseRelatedCards]') AND type in (N'U'))
DROP TABLE [dbo].[ReverseRelatedCards]
CREATE TABLE [dbo].[ReverseRelatedCards](
    [id] [int] IDENTITY(1,1) NOT NULL
    , [cardId] [uniqueidentifier] NOT NULL
    , [data] [nvarchar](max) NOT NULL
    ) ON [PRIMARY]
--------
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[CardKeywords]') AND type in (N'U'))
DROP TABLE [dbo].[CardKeywords]
CREATE TABLE [dbo].[CardKeywords](
    [id] [int] IDENTITY(1,1) NOT NULL
    , [cardId] [uniqueidentifier] NOT NULL
    , [data] [nvarchar](max) NOT NULL
    ) ON [PRIMARY]
--------
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[CardAvailabilities]') AND type in (N'U'))
DROP TABLE [dbo].[CardAvailabilities]
CREATE TABLE [dbo].[CardAvailabilities](
    [id] [int] IDENTITY(1,1) NOT NULL
    , [cardId] [uniqueidentifier] NOT NULL
    , [data] [nvarchar](max) NOT NULL
    ) ON [PRIMARY]
--------
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[CardPromoTypes]') AND type in (N'U'))
DROP TABLE [dbo].[CardPromoTypes]
CREATE TABLE [dbo].[CardPromoTypes](
    [id] [int] IDENTITY(1,1) NOT NULL
    , [cardId] [uniqueidentifier] NOT NULL
    , [data] [nvarchar](max) NOT NULL
    ) ON [PRIMARY]
--------
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[CardColorIdentities]') AND type in (N'U'))
DROP TABLE [dbo].[CardColorIdentities]
CREATE TABLE [dbo].[CardColorIdentities](
    [id] [int] IDENTITY(1,1) NOT NULL
    , [cardId] [uniqueidentifier] NOT NULL
    , [data] [nvarchar](max) NOT NULL
    ) ON [PRIMARY]
--------
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[CardColorIndicators]') AND type in (N'U'))
DROP TABLE [dbo].[CardColorIndicators]
CREATE TABLE [dbo].[CardColorIndicators](
    [id] [int] IDENTITY(1,1) NOT NULL
    , [cardId] [uniqueidentifier] NOT NULL
    , [data] [nvarchar](max) NOT NULL
    ) ON [PRIMARY]
--------
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[CardColors]') AND type in (N'U'))
DROP TABLE [dbo].[CardColors]
CREATE TABLE [dbo].[CardColors](
    [id] [int] IDENTITY(1,1) NOT NULL
    , [cardId] [uniqueidentifier] NOT NULL
    , [data] [nvarchar](max) NOT NULL
    ) ON [PRIMARY]
--------
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[CardFrameEffects]') AND type in (N'U'))
DROP TABLE [dbo].[CardFrameEffects]
CREATE TABLE [dbo].[CardFrameEffects](
    [id] [int] IDENTITY(1,1) NOT NULL
    , [cardId] [uniqueidentifier] NOT NULL
    , [data] [nvarchar](max) NOT NULL
    ) ON [PRIMARY]
--------
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Translations]') AND type in (N'U'))
DROP TABLE [dbo].[Translations]
CREATE TABLE [dbo].[Translations](
    [id] [int] IDENTITY(1,1) NOT NULL
    , [cardId] [uniqueidentifier] NOT NULL
    , [data] [nvarchar](max) NOT NULL
    ) ON [PRIMARY]
--------
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[CardVariations]') AND type in (N'U'))
DROP TABLE [dbo].[CardVariations]
CREATE TABLE [dbo].[CardVariations](
    [id] [int] IDENTITY(1,1) NOT NULL
    , [cardId] [uniqueidentifier] NOT NULL
    , [data] [uniqueidentifier] NOT NULL
    ) ON [PRIMARY]
--------
