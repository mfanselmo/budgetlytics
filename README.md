# Budgetlitycs

## Planetscale

### Publishing changes to the db
- Develop locally, using development branch of db, pushing changes using `pnpx prisma db push`
- Create deploy request on planetscale (a pull request for the db)
  - If there are errors on the db (null values on new column, etc) will fail


### Adding columns with non null values
- Add the new column via a deploy request (the new column is not used by the app yet)
- Update my application code to write to the new column if there are any updates (still no reading from the column)
- Run the data migration to update all missing data (using something like rake tasks https://jakejs.com/docs-page.html#section-overview)
- Update my application code to make use of the new column (deploy to vercel)
- (optional) Add a null constraint to the column so that it will never be null again.