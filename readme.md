# CVM-FUND-EXPORATION-FRONT-END

## Planning

### Data cleaning and transforming

- More data
    - nr_cotst in investment_return
    - vl_patrim_liq in investment_return
    - moviment in investment_return (captc_dia+rest_dia)
    - for Performance, Risk, Consistency, Sharpe
        - YTD
        - MTD
        - 1M
        - 3M
        - 6M
- Cleaning
    - Strange data for CNPJ 20815620000196 after 2018-05-15 (should it filter by nr_cotst? or should it filter buggy CNPJs?)
    - What's the deal with Infinity and NaN fields

### Pages

- Main
    - Overall indicators
        - Individual
        - History
    - Top Changes
        - Great Looser
        - Great Winners
        - Largest
        - Top Performers
        - Top Performer/Risk Ratio
        - Top Consistency
- Fund List
    - Column Selector
    - Filter
        - Risk Range
        - Consistency Range
        - Sharpe Range
        - Performance Range
        - Class
        - Benchmark
        - Avaliable at (Corretora)
        - Quote Fund
        - Exclusive Fund
        - Qualified Investor
        - Long Tax
    - Searcher
    - Table
        - Headers
            - Name
            - Net Worth
            - Risk
                - YTD
                - MTD
                - 1M
                - 3M
                - 6M
                - 1Y
                - 2Y
                - 3Y
            - Consistency
                - YTD
                - MTD
                - 1M
                - 3M
                - 6M
                - 1Y
                - 2Y
                - 3Y
            - Sharpe
                - YTD
                - MTD
                - 1M
                - 3M
                - 6M
                - 1Y
                - 2Y
                - 3Y
            - Performance                
                - YTD
                - MTD
                - 1M
                - 3M
                - 6M
                - 1Y
                - 2Y
                - 3Y
        - Row Content
            - Closed
                - Column selection
            - Open
                - Relative Period Selector
                - Series
                    - Risk
                    - Consistency
                    - Sharpe
                    - Performance
    - Navigator
- Fund Comparison
    - Fund Selector
        - Individual
        - Reference List
            - Broker
            - Class
            - Benchmark
    - Field Selector
        - X
        - Y
        - Size
        - Transparency
    - Bubble Chart
        - X
        - Y
        - Size
        - Transparency

### TODO

- [ ] Front-end
    - [ ] Main page
        - [X] v1 - Add github link
        - [ ] v1 - Add about
        - [X] v1 - Remove inexistent links
    - [ ] v3 - Indicators page
        - [ ] Chart feature
            - [ ] Indicators (CDI, Ibovesp, IPCA, IGM*)
            - [ ] Time range
            - [ ] Add Great Looser (Day, Month, Year)
            - [ ] Great Winners (Day, Month, Year)
            - [ ] Largest (Day, Month, Year)
            - [ ] Top Performers (Day, Month, Year)
            - [ ] Top Performer/Risk Ratio (Day, Month, Year)
            - [ ] Top Consistency (Day, Month, Year)
    - [ ] Fund list page
        - [ ] Changes to the fund list feature
            - [ ] v2 - Remove search button from search panel
            - [ ] v2 - Add net worth to the fund item
            - [ ] v2 - Add number of quoteholders
            - [ ] v2 - Add benchmark
        - [ ] Changes to the fund item feature
            - [ ] v2 - Add time range buttons to choose which column will be used
            - [ ] v2 - Add benchmark data
            - [ ] v2 - Add benchmark button to choose the benchmark
        - [ ] Changes to the search feature
            - [ ] v1 - Remove accents from the search term and results
        - [ ] Changes to the filter feature
            - [ ] v1 - Add missing fields to filter
            - [ ] v2 - Add filter suggestions
            - [ ] v2 - Filter options must be dinamically determined
        - [ ] Changes to the order feature
            - [ ] v1 - Add missing fields to order
            - [X] v1 - Replace (ASC) and (DESC) by icons
        - [ ] v2 - Add column selector
        - [ ] Changes to the code
            - [X] v1 - Componentize to an API lib
            - [X] v1 - Reorganize state
            - [ ] v2 - Componentize fund listing
            - [ ] v1 - Componentize ui parts in separate components
            - [X] v1 - Add loading state
            - [X] v1 - Add error handling
    - [ ] v4 - Fund Comparison page 
        - [ ] Reuse fund list page
        - [ ] Add fund selector
        - [ ] Add bubble chart
    - [ ] v5 - Miscellaneous
        - [ ] Improve UI for mobile 
- [ ] Back-end
    - [ ] Worker
        - [ ] v2 - Get Ibovespa Index
        - [ ] v2 - Get IPCA index
        - [ ] v2 - Get IGP* index
        - [ ] v2 - Add Ibovespa Index quote to investment return table
        - [ ] v2 - Add CDI quote to investment return table
        - [ ] v2 - Add IPCA quote to investment return table
        - [ ] v2 - Add IGP* quote to investment return table
        - [ ] v1 - Add an unaccented fund name to inf_cadastral    
        - [ ] v2 - Add YTD, MTD, 1M, 3M, 6M performance, risk, sharpe and consistency to investment return table
        - [ ] v2 - Add YTD, MTD, 1M, 3M, 6M quote performance, risk, sharpe and consistency to investment return table
        - [ ] v2 - Add 1Y, 2Y, 3Y quote performance to investment return table
        - [ ] v2 - Add nr_cotst to investment_return
        - [ ] v2 - Add vl_patrim_liq to investment_return
        - [ ] v2 - Add moviment to investment_return (captc_dia+rest_dia)
- [ ] Deployment
    - [ ] v1 - Worker container
    - [ ] v1 - Front-end container
    - [ ] v1 - Expose only-especific end-points
    - [ ] v1 - Create and use read-only user in the front-end
    - [ ] v1 - Add ratelimit to the proxy
    - [ ] v1 - Monitor resource usage
- [ ] v5 - UX
    - [ ] Optimizations
        - [ ] Check response times


