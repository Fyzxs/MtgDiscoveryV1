USE [MTG]
GO

ALTER TABLE [dbo].[Users] DROP CONSTRAINT [DF_User_Deleted]
    GO

ALTER TABLE [dbo].[Users] DROP CONSTRAINT [DF_User_UserId]
    GO

/****** Object:  Table [dbo].[Users]    Script Date: 1/21/2021 7:12:06 PM ******/
    IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND type in (N'U'))
DROP TABLE [dbo].[Users]
    GO

/****** Object:  Table [dbo].[Users]    Script Date: 1/21/2021 7:12:06 PM ******/
    SET ANSI_NULLS ON
    GO

    SET QUOTED_IDENTIFIER ON
    GO

CREATE TABLE [dbo].[Users](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [UserId] [uniqueidentifier] NOT NULL,
    [DisplayName] [nvarchar](max) NOT NULL,
    [Hash] [nvarchar](max) NOT NULL,
    [Deleted] [bit] NOT NULL
    ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
    GO

ALTER TABLE [dbo].[Users] ADD  CONSTRAINT [DF_User_UserId]  DEFAULT (newid()) FOR [UserId]
    GO

ALTER TABLE [dbo].[Users] ADD  CONSTRAINT [DF_User_Deleted]  DEFAULT ((0)) FOR [Deleted]
    GO


