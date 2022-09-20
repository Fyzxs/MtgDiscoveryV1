USE [MTG]
GO

/****** Object:  Table [dbo].[UserCards]    Script Date: 1/21/2021 7:12:00 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[UserCards]') AND type in (N'U'))
DROP TABLE [dbo].[UserCards]
    GO

/****** Object:  Table [dbo].[UserCards]    Script Date: 1/21/2021 7:12:00 PM ******/
    SET ANSI_NULLS ON
    GO

    SET QUOTED_IDENTIFIER ON
    GO

CREATE TABLE [dbo].[UserCards](
    [UserUuid] [uniqueidentifier] NOT NULL,
    [CardUuid] [uniqueidentifier] NOT NULL,
    [isForcedFoilSet] [bit] NOT NULL,
    [isForcedExtendedSet] [bit] NOT NULL,
    [isFoilOnly] [bit] NOT NULL,
    [setCode] [nvarchar](max) NOT NULL,
    [setType] [nvarchar](max) NOT NULL,
    [Count] [bigint] NOT NULL
    ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
    GO


