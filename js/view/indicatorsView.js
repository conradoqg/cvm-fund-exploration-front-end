
import Typography from '@material-ui/core/Typography';
import React from 'react';
import dayjs from 'dayjs';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import lightGreen from '@material-ui/core/colors/lightGreen';
import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/red';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import FilterListIcon from '@material-ui/icons/FilterList';
import Collapse from '@material-ui/core/Collapse';
import { withStyles } from '@material-ui/core/styles';
import { produce, setAutoFreeze } from 'immer';
import allKeys from 'promise-results/allKeys';
import createPlotlyComponent from 'react-plotly.js/factory';
import Plotly from 'plotly';
import * as d3Format from 'd3-format';
import ptBR from 'd3-format/locale/pt-BR.json';
import FundFilterView from './components/fundFilterView';

const Plot = createPlotlyComponent(Plotly);
d3Format.formatDefaultLocale(ptBR);

import API from '../api';
import { chooseState } from '../util';

setAutoFreeze(false);

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    optionsBar: {
        padding: theme.spacing.unit * 2
    },
    indicatorValuePositive: {
        color: lightGreen[500]
    },
    indicatorValueBlue: {
        color: blue[500]
    },
    indicatorValueNegative: {
        color: red[500]
    },
    select: {
        margin: theme.spacing.unit
    },
    cropText: {
        maxWidth: '20em',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    }
});

const emptyState = {
    data: {
        fundIndicators: null,
        economyIndicators: null,
        fundsChanged: {
            btgpactual: null,
            xpi: null
        }
    },
    config: {
        range: '1y',
        changesRange: '1w',
        filter: FundFilterView.emptyState.config.filter
    },
    layout: {
        showingFilter: false
    }
};

class IndicatorsView extends React.Component {
    state = emptyState;

    handleConfigRangeChange = async event => {
        const nextState = produce(this.state, draft => {
            draft.config[event.target.name] = event.target.value;
        });
        return this.updateData(nextState);
    }

    handleChartInitialized = async (figure) => {
        this.setState(produce(draft => {
            draft.data.economyIndicators = figure;
        }));
    }

    handleChartUpdate = async (figure) => {
        this.setState(produce(draft => {
            draft.data.economyIndicators = figure;
        }));
    }

    handleFilterClick = () => {
        this.setState(produce(draft => {
            draft.layout.showingFilter = !draft.layout.showingFilter;
        }));
    }

    handleFilterChanged = async (filter) => {
        const nextState = produce(this.state, draft => {
            draft.config.filter = filter;
            draft.layout.showingFilter = false;
        });

        return this.updateData(nextState);
    }

    async componentDidMount() {
        return this.updateData(this.state);
    }

    updateData = async (nextState) => {
        try {
            const { fundIndicators, economyIndicators, fundsChanged } = await allKeys({
                fundIndicators: this.getFundIndicators(nextState.config),
                economyIndicators: this.getEconomyIndicators(nextState.config),
                fundsChanged: this.getFundsChanged(nextState.config)
            });

            nextState = produce(nextState, draft => {
                draft.data.fundIndicators = fundIndicators;
                draft.data.economyIndicators = economyIndicators;
                draft.data.fundsChanged = fundsChanged;
            });

            this.setState(nextState);
        } catch (ex) {
            console.error(ex.message);
            this.setState(produce(draft => {
                draft.data.fundIndicators = ex.message;
            }));
        }
    }

    async getEconomyIndicators(config) {

        let from = null;
        let range = null;

        switch (config.range) {
            case 'mtd':
                from = new Date((new Date()).getFullYear(), (new Date()).getMonth(), 1);
                break;
            case 'ytd':
                from = new Date((new Date()).getFullYear(), 0, 1);
                break;
            case '1m':
                range = 21;
                break;
            case '3m':
                range = 63;
                break;
            case '6m':
                range = 126;
                break;
            case '1y':
                range = 252;
                break;
            case '2y':
                range = 504;
                break;
            case '3y':
                range = 756;
                break;
        }

        const economyIndicators = await API.getEconomyIndicators(range == null ? from : range);

        return {
            data: [
                {
                    x: economyIndicators.date,
                    y: economyIndicators.bovespa,
                    type: 'scatter',
                    name: 'Bovespa'
                },
                {
                    x: economyIndicators.date,
                    y: economyIndicators.dolar,
                    type: 'scatter',
                    name: 'Dólar',
                    yaxis: 'y2'
                },
                {
                    x: economyIndicators.date,
                    y: economyIndicators.euro,
                    type: 'scatter',
                    name: 'Euro',
                    yaxis: 'y3'
                }
            ],
            layout: {
                title: name,
                separators: ',.',
                autosize: true,
                showlegend: true,
                legend: { 'orientation': 'h' },
                xaxis: {
                    showspikes: true,
                    spikemode: 'across',
                    domain: [0.00, 0.95]
                },
                yaxis: {
                    title: 'Bovespa',
                    tickformat: ',.0',
                    hoverformat: ',.2',
                    fixedrange: true
                },
                yaxis2: {
                    title: 'Dólar',
                    anchor: 'x',
                    overlaying: 'y',
                    side: 'right',
                    tickprefix: 'R$ ',
                    tickformat: ',.2f',
                    hoverformat: ',.2f',
                    fixedrange: true,
                    position: 0.95
                },
                yaxis3: {
                    title: 'Euro',
                    anchor: 'free',
                    overlaying: 'y',
                    side: 'right',
                    tickprefix: 'R$ ',
                    tickformat: ',.2f',
                    hoverformat: ',.2f',
                    fixedrange: true,
                    position: 1
                }
            }
        };
    }

    async getFundIndicators(config) {
        return await API.getFundIndicators(config);
    }

    async getFundsChanged(config) {
        let from = null;
        switch (config.changesRange) {
            case '1w':
                from = dayjs().subtract(1, 'week').toDate();
                break;
            case '1m':
                from = dayjs().subtract(1, 'month').toDate();
                break;
            case '3m':
                from = dayjs().subtract(3, 'month').toDate();
                break;
            case '6m':
                from = dayjs().subtract(6, 'month').toDate();
                break;
            case '1y':
                from = dayjs().subtract(1, 'year').toDate();
                break;
            case '2y':
                from = dayjs().subtract(2, 'year').toDate();
                break;
            case '3y':
                from = dayjs().subtract(3, 'year').toDate();
                break;
        }

        const fundsChanged = await API.getFundsChanged(from);

        const fundsChanges = {
            btgpactual: [],
            xpi: []
        };

        fundsChanged.map(change => {
            const key = change.table_name == 'btgpactual_funds' ? 'btgpactual' : 'xpi';

            const relevantChanges = [];

            if (change.action == 'I') relevantChanges.push('Adicionado a lista de fundos');
            else if (change.action == 'D') relevantChanges.push('Removido da lista de fundos');
            else {
                Object.keys(change.changed_fields).map(changedField => {
                    const capitalized = value => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

                    const relevantFields = {
                        xf_state: {
                            title: 'Captação',
                            text: value => value == '1' ? 'Fechada' : 'Aberta'
                        },
                        xf_formal_risk: {
                            title: 'Risco formal',
                            text: value => ['Desconhecido', 'Risco baixo', 'Risco médio baixo', 'Risco médio', 'Risco médio alto', 'Risco alto'][value]
                        },
                        xf_initial_investment: {
                            title: 'Investimento inicial',
                            text: d3Format.format(',.2f')
                        },
                        xf_rescue_financial_settlement: {
                            title: 'Dias para resgate',
                            text: value => `D+${value}`
                        },
                        bf_is_blacklist: {
                            title: 'Captação',
                            text: value => value == 't' ? 'Fechada' : 'Aberta'
                        },
                        bf_inactive: {
                            title: 'Captação',
                            text: value => value ? 'Aberta' : 'Fechada'
                        },
                        bf_risk_name: {
                            title: 'Risco formal',
                            text: capitalized
                        },
                        bf_minimum_initial_investment: {
                            title: 'Investimento inicial',
                            text: d3Format.format(',.2f')
                        },
                        bf_rescue_financial_settlement: {
                            title: 'Dias para resgate',
                            text: value => `D+${value}`
                        },
                        bf_investor_type: {
                            title: 'Tipo de investidor',
                            text: value => value == 'NAO_QUALIFICADO' ? 'Não qualificado' : 'Qualificado'
                        }
                    };
                    if (relevantFields[changedField]) {
                        relevantChanges.push(`${relevantFields[changedField].title} mudou de ${relevantFields[changedField].text(change.row_data[changedField])} para ${relevantFields[changedField].text(change.changed_fields[changedField])}`);
                    }
                });
            }

            if (relevantChanges.length > 0)
                fundsChanges[key].push({
                    name: change.f_short_name,
                    changes: relevantChanges
                });
        });

        return fundsChanges;
    }

    render() {
        const { globalClasses, classes } = this.props;

        return (
            <div>
                <div className={globalClasses.appBarSpacer} />
                <Grid container wrap="nowrap">
                    <Grid container alignItems="center" justify="flex-start">
                        <Typography variant="display1" gutterBottom>Indicadores</Typography>
                    </Grid>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Select
                                value={this.state.config.range}
                                onChange={this.handleConfigRangeChange}
                                className={classes.select}
                                inputProps={{
                                    name: 'range',
                                    id: 'range',
                                }}
                            >
                                <MenuItem value={'mtd'}>Nesse mês</MenuItem>
                                <MenuItem value={'ytd'}>Nesse ano</MenuItem>
                                <MenuItem value={'1m'}>1 mês</MenuItem>
                                <MenuItem value={'3m'}>3 meses</MenuItem>
                                <MenuItem value={'6m'}>6 meses</MenuItem>
                                <MenuItem value={'1y'}>1 ano</MenuItem>
                                <MenuItem value={'2y'}>2 anos</MenuItem>
                                <MenuItem value={'3y'}>3 anos</MenuItem>
                            </Select>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container wrap="nowrap">
                    <Grid container alignItems="center" justify="flex-start">
                        <Typography variant="headline" gutterBottom>Mercado</Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={16}>
                    <Grid item xs={12}>
                        <Paper className={classes.paper} elevation={1} square={true}>
                            <EconomyHistoryChart
                                fund={this.state.data.economyIndicators}
                                onInitialized={(figure) => this.handleChartInitialized(figure)}
                                onUpdate={(figure) => this.handleChartUpdate(figure)}
                            />
                        </Paper>
                    </Grid>
                </Grid>
                <br />
                <Grid container wrap="nowrap">
                    <Grid container alignItems="center" justify="flex-start">
                        <Typography variant="headline" gutterBottom>Fundos de Investimento</Typography>
                    </Grid>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <IconButton
                                aria-label="Filtro"
                                onClick={this.handleFilterClick}>
                                <FilterListIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container spacing={16}>
                    <Grid item xs={12}>
                        <Paper elevation={1} square={true}>
                            <Collapse in={this.state.layout.showingFilter}>
                                <FundFilterView onFilterChanged={this.handleFilterChanged} />
                            </Collapse>
                        </Paper>
                    </Grid>
                </Grid>
                <Grid container spacing={16}>
                    <Grid item xs={3}>
                        <IndicatorPaper title="Desempenho" field="investment_return" range={this.state.config.range} data={this.state.data.fundIndicators} classes={classes} />
                    </Grid>
                    <Grid item xs={3}>
                        <IndicatorPaper title="Patrimônio" field="networth" range={this.state.config.range} data={this.state.data.fundIndicators} classes={classes} />
                    </Grid>
                    <Grid item xs={3}>
                        <IndicatorPaper title="Cotistas" field="quotaholders" range={this.state.config.range} data={this.state.data.fundIndicators} classes={classes} />
                    </Grid>
                    <Grid item xs={3}>
                        <IndicatorPaper title="Risco" field="risk" range={this.state.config.range} data={this.state.data.fundIndicators} classes={classes} inverted />
                    </Grid>
                </Grid>
                <br />
                <Grid container wrap="nowrap">
                    <Grid container alignItems="center" justify="flex-start">
                        <Typography variant="headline" gutterBottom>Mudanças nos Fundos</Typography>
                    </Grid>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Select
                                value={this.state.config.changesRange}
                                onChange={this.handleConfigRangeChange}
                                className={classes.select}
                                inputProps={{
                                    name: 'changesRange',
                                    id: 'changesRange',
                                }}
                            >
                                <MenuItem value={'1w'}>1 semana</MenuItem>
                                <MenuItem value={'1m'}>1 mês</MenuItem>
                                <MenuItem value={'3m'}>3 mês</MenuItem>
                                <MenuItem value={'6m'}>6 meses</MenuItem>
                                <MenuItem value={'1y'}>1 ano</MenuItem>
                                <MenuItem value={'2y'}>2 anos</MenuItem>
                                <MenuItem value={'3y'}>3 anos</MenuItem>
                            </Select>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container spacing={16}>
                    <Grid item xs={6}>
                        <FundsChangedPaper title="BTG Pactual" data={this.state.data.fundsChanged['btgpactual']} classes={classes} />
                    </Grid>
                    <Grid item xs={6}>
                        <FundsChangedPaper title="XP Investimentos" data={this.state.data.fundsChanged['xpi']} classes={classes} />
                    </Grid>
                </Grid>
            </div >
        );
    }
}

const FundsChangedPaper = (props) => {
    const { classes, title, data } = props;

    return (
        <div>
            <Paper elevation={1} square={true}>
                <Grid container wrap="nowrap" className={classes.optionsBar}>
                    <Typography component="h2" variant="headline">{title}</Typography>
                </Grid>
            </Paper>
            <Paper className={classes.paper} elevation={1} square={true}>
                <List>
                    {
                        chooseState(data,
                            () => {
                                return data.map((change, index) => (
                                    <div key={index}>
                                        <ListItem divider>
                                            <ListItemText disableTypography>
                                                <Typography component="span" variant="body1" className={classes.cropText}>{change.name}</Typography>
                                            </ListItemText>
                                            <ListItemSecondaryAction>
                                                {
                                                    change.changes.map((fieldChange, index) => (
                                                        <Typography key={index} component="span" variant="body1" align="right">{fieldChange}</Typography>
                                                    ))
                                                }
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    </div>
                                ));
                            },
                            () => (<Typography variant="subheading" align="center"><CircularProgress className={classes.progress} /></Typography>),
                            () => (<Typography variant="subheading" align="center">Não foi possível carregar o dado, tente novamente mais tarde.</Typography>),
                            () => (<Typography variant="subheading" align="center">Sem dados à exibir</Typography>)
                        )
                    }
                </List>
            </Paper>
        </div>);
};

const IndicatorPaper = (props) => {
    const { classes, range, title, field, data, inverted = false } = props;

    const getClassForValue = value => {
        if (value == 0)
            return classes.indicatorValueBlue;
        else if (value > 0)
            return inverted ? classes.indicatorValueNegative : classes.indicatorValuePositive;
        else if (value < 0)
            return inverted ? classes.indicatorValuePositive : classes.indicatorValueNegative;
    };

    const formatValue = value => (value * 100).toFixed(2);

    return (
        <div>
            <Paper elevation={1} square={true}>
                <Grid container wrap="nowrap" className={classes.optionsBar}>
                    <Typography component="h2" variant="headline">{title}</Typography>
                </Grid>
            </Paper>
            <Paper className={classes.paper} elevation={1} square={true}>
                {
                    chooseState(data,
                        () => {
                            const positive = data[range][field]['top'].map((indicator, index) => (
                                <div key={index}>
                                    <ListItem divider>
                                        <ListItemText disableTypography>
                                            <Typography component="span" variant="body1" className={classes.cropText}>{indicator.name}</Typography>
                                        </ListItemText>
                                        <ListItemSecondaryAction>
                                            <Typography component="span" variant="body1" className={getClassForValue(indicator.value)}>{formatValue(indicator.value)}%</Typography>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                </div>
                            ));
                            const divider = (< ListItem divider >
                                <ListItemText disableTypography={true}>
                                    <Typography component="span" variant="body1" align="center">...</Typography>
                                </ListItemText>
                            </ListItem>);
                            const negative = data[range][field]['bottom'].map((indicator, index) => (
                                <div key={index}>
                                    <ListItem divider>
                                        <ListItemText disableTypography>
                                            <Typography component="span" variant="body1" className={classes.cropText}>{indicator.name}</Typography>
                                        </ListItemText>
                                        <ListItemSecondaryAction>
                                            <Typography component="span" variant="body1" className={getClassForValue(indicator.value)}>{formatValue(indicator.value)}%</Typography>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                </div>
                            ));
                            return (<List>
                                {positive}
                                {divider}
                                {negative}
                            </List>);
                        },
                        () => (<Typography variant="subheading" align="center"><CircularProgress className={classes.progress} /></Typography>),
                        () => (<Typography variant="subheading" align="center">Não foi possível carregar o dado, tente novamente mais tarde.</Typography>),
                        () => (<Typography variant="subheading" align="center">Sem dados à exibir</Typography>)
                    )
                }
            </Paper>
        </div>);
};

const EconomyHistoryChart = (props) => {
    const { fund, handleChartInitialized, handleChartUpdate } = props;

    return chooseState(
        fund,
        () => (
            <Plot
                key={fund.name}
                data={fund.data}
                layout={fund.layout}
                config={
                    {
                        locale: 'pt-BR',
                        displayModeBar: true
                    }
                }
                onInitialized={handleChartInitialized}
                onUpdate={handleChartUpdate}
                useResizeHandler={true}
                style={{ width: '100%', height: '100%' }}
            />
        ),
        () => (
            <Typography variant="subheading" align="center"><CircularProgress /></Typography>
        ),
        () => (
            <Typography variant="subheading" align="center">Não foi possível carregar o dado, tente novamente mais tarde.</Typography>
        ));
};

module.exports = withStyles(styles)(IndicatorsView);