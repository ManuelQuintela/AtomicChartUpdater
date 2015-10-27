# AtomicChartUpdater

Plugin for the ChartJs library, that provides functions for easily make multiple dynamic asynchornous updates to their charts that behave atomically.

This tool ensures that either all the asynchronous changes are applied to the chart, or the changes are reverted to the last valid update.

The requests can be done all at once, with the responses arriving in an indeterminate order, or sequentially in a specific order, with an optional delay between responses, where each change is updated after the previous one is completed.

The developer can also define an error tolerance policy, where the update can be accepted if a certain number of failed responses (defined by him) is not surpassed.
