/****** Object:  Table [dbo].[CardPriceInfo]    Script Date: 3/12/2021 6:58:44 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[CardPriceInfo]') AND type in (N'U'))
DROP TABLE [dbo].[CardPriceInfo]
    GO

/****** Object:  Table [dbo].[CardPriceInfo]    Script Date: 3/12/2021 6:58:44 AM ******/
    SET ANSI_NULLS ON
    GO

    SET QUOTED_IDENTIFIER ON
    GO

CREATE TABLE [dbo].[CardPriceInfo](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [cardId] [uniqueidentifier] NOT NULL,
    [averageFoil] [decimal](18, 2) NOT NULL,
    [averageRegular] [decimal](18, 2) NOT NULL,
    [latestFoil] [decimal](18, 2) NOT NULL,
    [latestRegular] [decimal](18, 2) NOT NULL
    ) ON [PRIMARY]
    GO


