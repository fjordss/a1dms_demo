import { DateRangePicker, Modal, Select } from 'a1dms-front';
import React from 'react'
import { app } from '../ManagementApp';

export interface GraphicsState {
    showDatePicker: boolean;
    dateFrom: string;
    dateTo: string;
    query: Map<string, Array<string>>;
    loading: boolean;
}

declare let Chart: any;

export default class Graphics extends React.Component<{}, GraphicsState> {
    public constructor(props) {
        super(props);

        this.state = {
            showDatePicker: false,
            dateFrom: DateRangePicker.getRange("cm")[0],
            dateTo: null,
            query: new Map<string, Array<string>>(),
            loading: true
        };

        this.onFieldValueChanged("from", [this.state.dateFrom]);
    }

    public render() {
        return (
            <div>
                <Modal height={270} header="Select range" visible={this.state.showDatePicker} onClose={() => this.setState({ showDatePicker: false })}>
                    <DateRangePicker onChange={(from, to) => this.dateRangeSelected(from, to)} />
                </Modal>

                <Modal loading={true} visible={this.state.loading} />

                <div className="report-search-area">
                    <div className="report-search-left">
                        <Select options={app.sites.map(s => s.text)} multiple={true} placeholder="Select sites..." width={200} onChange={v => this.onFieldValueChanged("sites", v)} />
                    </div>
                    <div className="report-search-left">
                        <Select options={app.companies.map(s => s.text)} multiple={true} placeholder="Select companies..." width={200} onChange={v => this.onFieldValueChanged("companies", v)} />
                    </div>
                    <div className="report-search-left">
                        <Select options={app.departments.map(s => s.text)} multiple={true} placeholder="Select departments..." width={200} onChange={v => this.onFieldValueChanged("departments", v)} />
                    </div>
                    <div className="report-search-left nopadding">
                        <input type="date" placeholder="From..." value={this.state.dateFrom} onChange={e => this.onDateChanged(e.currentTarget.value, "from")} />&nbsp;-&nbsp;
                        <input type="date" placeholder="To..." value={this.state.dateTo} onChange={e => this.onDateChanged(e.currentTarget.value, "to")} /> &nbsp;
                    </div>
                    <div className="report-search-left"><button className="date-picker-button" onClick={() => this.setState({ showDatePicker: true })}>...</button></div>
                    <div className="report-search-left"><button onClick={() => this.getReport()}>Get Report</button></div>
                </div>

                <table className="canvasTable" style={{ visibility: this.state.loading ? "hidden" : "visible" }}>
                    <tr>
                        <td id="bar1"></td>
                        <td id="bar2"></td>
                        <td id="bar3" colSpan={2}></td>
                    </tr>
                    <tr>
                        <td id="bar4" colSpan={4}></td>
                    </tr>
                    <tr>
                        <td id="bar5" colSpan={2}></td>
                        <td id="bar6" colSpan={2}></td>
                    </tr>
                    <tr>
                        <td id="pie1" style={{ width: "25%" }}></td>
                        <td id="pie2" style={{ width: "25%" }}></td>
                        <td id="pie3" style={{ width: "25%" }}></td>
                        <td id="pie4" style={{ width: "25%" }}></td>
                    </tr>
                    <tr>
                        <td id="bar7" colSpan={4}></td>
                    </tr>
                </table>
            </div>
        );
    }

    public componentDidMount() {
        this.getReport();
    }

    private getReport() {
        if (!this.state.loading)
            this.setState({ loading: true });
        
        let url = "/api/reporting/graphics";

        let add: Array<string> = [];
        for (let key of this.state.query.keys())
            this.state.query.get(key).forEach(v => add.push(key + "=" + encodeURIComponent(v)));

        if (add.length > 0)
            url += (url.indexOf("?") == -1 ? "?" : "&") + add.join("&");


        fetch(url)
            .then(res => res.json())
            .then(res => {
                this.createPie1(res.data.base);
                this.createPie2(res.data.base);
                this.createPie3(res.data.base);
                this.createPie4(res.data.base);

                this.createBar1(res.data.base);
                this.createBar2(res.data.base);
                this.createBar3(res.data.byDepartment);
                this.createBar4(res.data.byCompany);
                this.createBar5(res.data.byENLDepartment);
                this.createBar6(res.data.base);
                this.createBar7(res.data.base);

                this.setState({ loading: false });
            });
    }

    private onDateChanged(value: string, field: string) {
        if (field == "from")
            this.setState({ dateFrom: value })
        else if (field == "to")
            this.setState({ dateTo: value })

        this.onFieldValueChanged(field, [value]);
    }

    private onFieldValueChanged(field: string, values: Array<string>) {
        this.state.query.set(field, values);
    }

    private dateRangeSelected(from: string, to?: string) {
        this.onFieldValueChanged("from", [from]);

        if (to)
            this.onFieldValueChanged("to", [to]);

        this.setState({
            dateFrom: from,
            dateTo: to,
            showDatePicker: false
        });
    }

    private createBar7(data) {
        var ar = [
            "PPE", "PPE",
            "PinchPoints", "Pinch Points",
            "ContactWithObject", "Contact With Object",
            "HandsSafety", "Hands Safety",
            "Housekeeping", "Housekeeping",
            "OffTheSite", "Off the Site",
            "WeatherConditions", "Weather Conditions",
            "COVID19", "COVID-19",
            "WarningSigns", "Warning Signs / Barricades",
            "Ergonomics", "Ergonomics",
            "ToolsEquipment", "Tools Equipment",
            "WellControl", "Well Control",
            "PoliciesProcedures", "Policies / Procedures",
            "Security", "Security",
            "WorkEnvironmental", "Work Environmental / Design",
            "ManualLifting", "Manual Lifting / Handling",
            "ProcessSafety", "Process Safety",
            "Environmental", "Environmental",
            "Chemicals", "Chemicals",
            "LineOfFire", "\"Line of Fire\"",
            "Other", "Other",
            "TransportSafety", "Transport Safety",
            "StressRush", "Stress / Rush / Fatique / Distraction",
            "ElectricalSafety", "Electrical Safety",
            "SlipsTripsFalls", "Slips Trips Falls",
            "FireSafety", "Fire Safety",
            "Communication", "Communication",
            "Hygiene", "Hygiene",
            "DroppedObjects", "Dropped Objects"
        ];

        var dataset1 = [];
        var dataset2 = [];
        var dataset3 = [];
        var labels = [];
        for (var i = 0; i < ar.length; i += 2) {
            dataset1.push(data["hid" + (ar[i] == "PPE" ? "ppe" : ar[i])]);
            dataset2.push(data["safe" + ar[i]]);
            dataset3.push(data["unsafe" + ar[i]]);

            labels.push(ar[i + 1]);
        }

        var config = {
            type: 'bar',
            data: {
                datasets: [
                    {
                        label: "Hazard ID",
                        data: dataset1,
                        backgroundColor: "#740000",
                        datalabels: { anchor: 'end' }
                    },
                    {
                        label: "Safe Behavior",
                        data: dataset2,
                        backgroundColor: "#00B050",
                        datalabels: { anchor: 'end' }
                    },
                    {
                        label: "Unsafe Behavior",
                        data: dataset3,
                        backgroundColor: "#FF0000",
                        datalabels: { anchor: 'end' }
                    }
                ],
                labels: labels
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: { fontColor: "#000" }
                },
                title: {
                    display: true,
                    text: "Number of Reports Submitted",
                    fontColor: "#000",
                    fontSize: 15
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            fontColor: "#000",
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            fontColor: "#000"
                        }
                    }]
                },
                plugins: {
                    datalabels: {
                        color: "black",
                        align: "top",
                        offset: -3,
                        display: (context) => context.dataset.data[context.dataIndex] !== 0
                    }
                }
            },
        };

        new Chart(this.getContext("bar7", "380px", "280px"), config);
    }

    private createBar6(data) {
        var ar = [
            "LiftingAndHoisting", "Lifting and Hoisting",
            "MobileEquipment", "Mobile Equipment",
            "RotatingEquipment", "Rotating Equipment",
            "BreakingContainment", "Breaking Containment",
            "WorkingAtHeight", "Working at Height",
            "HotWork", "Hot Work",
            "ConfinedSpaceEntry", "Confined Space Entry",
            "EnergyIsolation", "Energy Isolation",
            "WorkAuthorization", "Work Authorization",
            "CriticalDevices", "Critical Devices",
            "CriticalProcedures", "Critical Procedures"
        ];

        var dataset1 = [];
        var dataset2 = [];
        var labels = [];
        for (var i = 0; i < ar.length; i += 2) {
            dataset1.push(data["safe" + ar[i]]);
            dataset2.push(data["unsafe" + ar[i]]);
            labels.push(ar[i + 1]);
        }

        var config = {
            type: 'bar',
            data: {
                datasets: [
                    {
                        label: "Safe",
                        data: dataset1,
                        backgroundColor: "#6A4090"
                    },
                    {
                        label: "Unsafe",
                        data: dataset2,
                        backgroundColor: "#ED7D31"
                    },
                ],
                labels: labels
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: true,
                    position: 'right',
                    labels: { fontColor: "#000" }
                },
                title: {
                    display: true,
                    text: "Life Saving Actions",
                    fontColor: "#000",
                    fontSize: 15
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            fontColor: "#000"
                        }
                    }],
                    xAxes: [{ ticks: { fontColor: "#000" } }]
                },
                plugins: {
                    datalabels: {
                        color: 'white',
                        display: c => c.dataset.data[c.dataIndex] !== 0
                    }
                }
            },
        };

        new Chart(this.getContext("bar6", "380px", "280px"), config);
    }

    private createBar5(data) {
        var chartData = {
            datasets: [{
                data: data.map(i => i["count"]),
                backgroundColor: data.map(i => "#6A408F")
            }],
            labels: data.map(i => i["department"])
        }

        var config = {
            type: 'bar',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: "Number of Reports Submitted by ENL Department",
                    fontColor: "#000",
                    fontSize: 15
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            fontColor: "#000"
                        }
                    }],
                    xAxes: [{ ticks: { fontColor: "#000" } }]
                },
                plugins: {
                    datalabels: {
                        color: 'white',
                        display: c => c.dataset.data[c.dataIndex] !== 0
                    }
                }
            },
        };

        new Chart(this.getContext("bar5", "380px", "280px"), config);
    }

    private createBar4(data) {
        var chartData = {
            datasets: [{
                data: data.map(i => i["count"]),
                backgroundColor: data.map(i => "#4472C5"),
                datalabels: { anchor: 'end' }
            }],
            labels: data.map(i => i["company"])
        }

        var config = {
            type: 'bar',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: "Number of Reports Submitted by Company",
                    fontColor: "#000",
                    fontSize: 15
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            fontColor: "#000"
                        }
                    }],
                    xAxes: [{ ticks: { fontColor: "#000" } }]
                },
                plugins: {
                    datalabels: {
                        color: "black",
                        align: "top",
                        offset: -3,
                        display: c => c.dataset.data[c.dataIndex] !== 0
                    }
                }
            },
        };

        new Chart(this.getContext("bar4", "380px", "280px"), config);
    }

    private createBar3(data) {
        var chartData = {
            datasets: [{
                data: data.map(i => i["count"]),
                backgroundColor: data.map(i => "#548134")
            }],
            labels: data.map(i => i["department"])
        }

        var config = {
            type: 'bar',
            data: chartData,
            options: {
                responsive: false,
                maintainAspectRatio: false,
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: "Number of Reports Submitted by Department",
                    fontColor: "#000",
                    fontSize: 15
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            fontColor: "#000"
                        }
                    }],
                    xAxes: [{ ticks: { fontColor: "#000" } }]
                },
                plugins: {
                    datalabels: {
                        color: 'white',
                        display: c => c.dataset.data[c.dataIndex] !== 0
                    }
                }
            },
        };

        new Chart(this.getContext("bar3", "100%", "280px"), config);

        document.getElementById("bar3_canvas").style.position = "relative";
        document.getElementById("bar3_canvas").style.top = "-20px";
    }

    private createBar2(data) {
        var n1 = data["total"];
        var n2 = data["hazardID"];
        var n3 = data["totalBehavior"];
        var n4 = data["safeBehavior"];
        var n5 = data["unsafeBehavior"];

        var config = {
            type: 'bar',
            data: {
                datasets: [
                    {
                        label: "Safe",
                        data: [n4, 0, n4],
                        backgroundColor: ["green", "green", "green"]
                    },
                    {
                        label: "Unsafe",
                        data: [n2 + n5, n2, n5],
                        backgroundColor: ["red", "red", "red"]
                    },
                ],
                labels: ["Total", "Hazard ID", "Behavior Based Observations"]
            },
            options: {
                responsive: false,
                maintainAspectRatio: false,
                legend: {
                    display: true,
                    position: 'right',
                    labels: { fontColor: "#000" }
                },
                title: {
                    display: true,
                    text: "Number of Reports Submitted",
                    fontColor: "#000",
                    fontSize: 15
                },
                scales: {
                    xAxes: [{
                        stacked: true,
                        ticks: { fontColor: "#000" }
                    }],
                    yAxes: [{
                        stacked: true,
                        ticks: {
                            beginAtZero: true,
                            fontColor: "#000"
                        }
                    }]
                },
                plugins: {
                    datalabels: {
                        color: 'white',
                        display: c => c.dataset.data[c.dataIndex] !== 0
                    }
                }
            },
        };

        new Chart(this.getContext("bar2", "380px", "280px"), config);

        document.getElementById("bar2_canvas").style.position = "relative";
        document.getElementById("bar2_canvas").style.top = "-20px";
    }

    private createBar1(data) {
        var n1 = data["total"];
        var n2 = data["hazardID"];
        var n3 = data["totalBehavior"];
        var n4 = data["safeBehavior"];
        var n5 = data["unsafeBehavior"];

        var config = {
            type: 'bar',
            data: {
                datasets: [{
                    data: [n1, n2, n3, n4, n5],
                    backgroundColor: ["#2A7DFF", "#FF6F0D", "#FFC261", "#19B225", "#DB5757"]
                }],
                labels: ["Total", "Hazard ID", "Total Behavior Based Observations", "Safe Behavior", "Unsafe Behavior"],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: "Number of Reports Submitted",
                    fontColor: "#000",
                    fontSize: 15
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            fontColor: "#000",
                            beginAtZero: true
                        }
                    }],
                    xAxes: [{ ticks: { fontColor: "#000" } }]
                },
                plugins: {
                    datalabels: {
                        color: 'white',
                        display: c => c.dataset.data[c.dataIndex] !== 0
                    }
                }
            },

        };

        new Chart(this.getContext("bar1", "380px", "330px"), config);
    }

    private createPie1(data) {
        var sum = data["notApplicable"] + data["headBeforeHands"] + data["stayFocused"] + data["lmra"] + data["biases"] + data["safetyTraps"];
        var n1 = this.getPercent(data["notApplicable"], sum);
        var n2 = this.getPercent(data["headBeforeHands"], sum);
        var n3 = this.getPercent(data["stayFocused"], sum);
        var n4 = this.getPercent(data["lmra"], sum);
        var n5 = this.getPercent(data["biases"], sum);
        var n6 = this.getPercent(data["safetyTraps"], sum);

        var config = {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [n1, n2, n3, n4, n5, n6],
                    backgroundColor: ["#a3a3a3", "#8DA7D9", "#E97C30", "#FB0000", "#FBBD00", "#6EAB46"],
                }],
                labels: ["Not Applicable", "Head Before Hands", "Stay Focused", "LMRA", "Biases", "Safety Traps"]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: true,
                    position: 'right',
                    labels: { fontColor: "#000" }
                },
                title: {
                    display: true,
                    text: "Safe Choice",
                    fontColor: "#000",
                    fontSize: 15
                },
                plugins: {
                    datalabels: {
                        color: 'white',
                        formatter: value => value + "%",
                        display: c => c.dataset.data[c.dataIndex] !== 0
                    }
                }
            },

        };

        new Chart(this.getContext("pie1", "380px", "280px"), config);
    }

    private createPie2(data) {
        var sum = data["hazardID"] + data["totalBehavior"];
        var n1 = this.getPercent(data["hazardID"], sum);
        var n2 = this.getPercent(data["totalBehavior"], sum);

        var config = {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [n1, n2],
                    backgroundColor: ["#001E5E", "#FBC104"],
                }],
                labels: ["Hazard ID", "Total Behavior Based Observation"]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: true,
                    position: 'right',
                    labels: { fontColor: "#000" }
                },
                title: {
                    display: true,
                    text: "Types of Proactive Reports",
                    fontColor: "#000",
                    fontSize: 15
                },
                plugins: {
                    datalabels: {
                        color: 'white',
                        formatter: value => value + "%",
                        display: c => c.dataset.data[c.dataIndex] !== 0
                    }
                }
            },

        };

        new Chart(this.getContext("pie2", "465px", "280px"), config);
    }

    private createPie3(data) {
        var sum = data["safeBehavior"] + data["unsafeBehavior"];
        var n1 = this.getPercent(data["safeBehavior"], sum);
        var n2 = this.getPercent(data["unsafeBehavior"], sum);

        var config = {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [n1, n2],
                    backgroundColor: ["#00AD4E", "#BD0000"],
                }],
                labels: ["Save", "Unsafe"]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: true,
                    position: 'right',
                    labels: { fontColor: "#000" }
                },
                title: {
                    display: true,
                    text: "Behavior Based Observations",
                    fontColor: "#000",
                    fontSize: 15
                },
                plugins: {
                    datalabels: {
                        color: 'white',
                        formatter: value => value + "%",
                        display: c => c.dataset.data[c.dataIndex] !== 0
                    }
                }
            },

        };

        new Chart(this.getContext("pie3", "317px", "280px"), config);
    }

    private createPie4(data) {
        var sum = data["safeLSA"] + data["unsafeLSA"] + data["nonLSA"];
        var n1 = this.getPercent(data["safeLSA"], sum);
        var n2 = this.getPercent(data["unsafeLSA"], sum);
        var n3 = this.getPercent(data["nonLSA"], sum);

        var config = {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [n1, n2, n3],
                    backgroundColor: ["#00AD4E", "#BD0000", "#a3a3a3"],
                }],
                labels: ["Safe LSA", "Unsafe LSA", "non-LSA"]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: true,
                    position: 'right',
                    labels: { fontColor: "#000" }
                },
                title: {
                    display: true,
                    text: "Percentage of LSA Observations",
                    fontColor: "#000",
                    fontSize: 15
                },
                plugins: {
                    datalabels: {
                        color: 'white',
                        formatter: value => value + "%",
                        display: c => c.dataset.data[c.dataIndex] !== 0
                    }
                }
            },

        };

        new Chart(this.getContext("pie4", "345px", "280px"), config);
    }

    private getContext(id: string, width: string, height: string): CanvasRenderingContext2D {
        let cell = document.getElementById(id);
        cell.innerHTML = "";

        let canvas = document.createElement("canvas");
        canvas.id = id + "_canvas";
        canvas.style.width = width;
        canvas.style.height = height;

        cell.appendChild(canvas);

        return canvas.getContext("2d");
    }

    private getPercent(num: number, sum: number): number {
        return Math.round(100.0 * num / sum);
    }
}