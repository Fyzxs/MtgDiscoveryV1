USE [MTG]
GO

/****** Object:  StoredProcedure [dbo].[UpsertUserCard]    Script Date: 1/21/2021 7:11:50 PM ******/
DROP PROCEDURE [dbo].[UpsertUserCard]
GO

/****** Object:  StoredProcedure [dbo].[UpsertUserCard]    Script Date: 1/21/2021 7:11:50 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[UpsertUserCard]
	-- Add the parameters for the stored procedure here
	@UserUuid uniqueidentifier,
	@CardUuid uniqueidentifier,
	@isForcedFoilSet bit,
	@isForcedExtendedSet bit,
	@isFoilOnly bit,
	@setCode nvarchar(max),
	@setType nvarchar(max),
	@count int
AS
BEGIN

SELECT *
INTO #temp
FROM (
         SELECT *
         FROM UserCards
         WHERE UserUuid = @UserUuid
     ) AS x

begin tran
if exists (select * from #temp with (updlock,serializable)
					where
					    UserUuid = @UserUuid
					and CardUuid = @CardUuid
					and isForcedFoilSet = @isForcedFoilSet
					and isForcedExtendedSet = @isForcedExtendedSet
					and isFoilOnly = @isFoilOnly)
begin
		declare @newCount int = @count + (select count from #temp
											where
												UserUuid = @UserUuid
											and CardUuid = @CardUuid
											and isForcedFoilSet = @isForcedFoilSet
											and isForcedExtendedSet = @isForcedExtendedSet
											and isFoilOnly = @isFoilOnly)
	   IF(@newCount < 0) set @newCount = 0
update UserCards set count = @newCount
where
        UserUuid = @UserUuid
  and CardUuid = @CardUuid
  and isForcedFoilSet = @isForcedFoilSet
  and isForcedExtendedSet = @isForcedExtendedSet
  and isFoilOnly = @isFoilOnly
end
else
begin
insert into UserCards (UserUuid, CardUuid, isForcedFoilSet,isForcedExtendedSet, isFoilOnly, setCode, setType, Count )
values (@UserUuid, @CardUuid, @isForcedFoilSet, @isForcedExtendedSet, @isFoilOnly, @setCode, @setType, @count)
end
commit tran
END
GO


