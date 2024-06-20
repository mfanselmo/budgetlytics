# Scriptable

## Main goal

To be able to click an iOS shortcut, open a menu to select (timed) category then an alert or something to enter an amount

## Code flow

- Needs an API token
- Get the period start day (to not hardcode it) `/settings/getPeriodStartDay`
- Get all the timed categories in that period `/category/getAllInPeriod`
- Display them in a menu to the user
- (Optional) Select a currency
- Create a transaction