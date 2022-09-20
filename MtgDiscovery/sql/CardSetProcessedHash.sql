/****** Object:  Table [dbo].[CardSetProcessedHash]    Script Date: 3/12/2021 6:59:14 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[CardSetProcessedHash]') AND type in (N'U'))
DROP TABLE [dbo].[CardSetProcessedHash]
    GO

/****** Object:  Table [dbo].[CardSetProcessedHash]    Script Date: 3/12/2021 6:59:14 AM ******/
    SET ANSI_NULLS ON
    GO

    SET QUOTED_IDENTIFIER ON
    GO

CREATE TABLE [dbo].[CardSetProcessedHash](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [setCode] [varchar](10) NOT NULL,
    [hash] [varchar](128) NOT NULL
    ) ON [PRIMARY]
    GO


