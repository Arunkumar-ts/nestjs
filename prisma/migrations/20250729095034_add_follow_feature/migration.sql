BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Follows] (
    [id] INT NOT NULL IDENTITY(1,1),
    [followerId] INT NOT NULL,
    [followedId] INT NOT NULL,
    CONSTRAINT [Follows_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Follows_followerId_followedId_key] UNIQUE NONCLUSTERED ([followerId],[followedId])
);

-- AddForeignKey
ALTER TABLE [dbo].[Follows] ADD CONSTRAINT [Follows_followerId_fkey] FOREIGN KEY ([followerId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Follows] ADD CONSTRAINT [Follows_followedId_fkey] FOREIGN KEY ([followedId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
