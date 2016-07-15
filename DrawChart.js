function drawDemoCharts(data) {


    var ndx = crossfilter(data) ;

    dimAge = ndx.dimension(function(d) { return d.a*5 ; }) ;
    dimScore = ndx.dimension(function(d) { if(Math.round(d.gs)!=0){ return d.gs}; }) ;
    dimnv=ndx.dimension(function(d){return d.nv});
    dimAbs = ndx.dimension(function(d) { if(Math.round(d.as)!=0){ return Math.round(d.as)}; }) ;

    

    dimpg = ndx.dimension(function(d) { return d.pg ; }) ;
    dimMs = ndx.dimension(function(d) { return d.ms ; }) ;
    dimGen = ndx.dimension(function(d) { return d.gen ; }) ;


    dimvs = ndx.dimension(function(d) { return d.vs ; }) ;
    dimrv = ndx.dimension(function(d) { return d.rv ; }) ;

    dimIssue = ndx.dimension(function(d) { return d.is ; }) ;
    dimView = ndx.dimension(function(d) { return d.vi ; }) ;


    dimTotal = ndx.dimension(function(d) { return 1 ; }) ;
    nAge = dimAge.group().reduceCount(function(d) { return d.a  }) ;
    ngn = dimScore.group().reduceCount(function(d) { return d.gs;  }) ;
    nnv=dimnv.group().reduceCount(function(d) { return d.nv;  }) ;

    


    nAbs = dimAbs.group().reduceCount(function(d) { return Math.round(d.as);  }) ;

    nPg = dimpg.group();
    nMs = dimMs.group();
    nGen = dimGen.group();

    nvs = dimvs.group();
    nrv = dimrv.group();

    nIssue = dimIssue.group().reduceCount(function(d) { return d.is }) ;
    nView = dimView.group().reduceCount(function(d) { return d.vi }) ;

    
    f_nAbs=remove_empty_bins(nAbs);

    f_nView=remove_unknown_bins(nView);


    var n=ngn.size();
    var object_gn=ngn.top(n);
    
    var min_gn_score=0;
    var max_gn_score=100;
    for(var j=0;j<object_gn.length;j++){
        if(j==0){
            min_gn_score=object_gn[j].key;
            max_gn_score=object_gn[j].key;
        }
        else{
            if(min_gn_score>object_gn[j].key){
                min_gn_score=object_gn[j].key;
            }
            if(max_gn_score<object_gn[j].key){
                max_gn_score=object_gn[j].key;
            }
        }
    }

    /***************************************************************************************************************/

    var n2=nAbs.size();
    var object_gn2=nAbs.top(n2);
    
    var min_gn_score2=88;
    var max_gn_score2=100;
    for(var j=0;j<object_gn2.length;j++){
        if(j==0){
            min_gn_score2=object_gn2[j].key;
            max_gn_score2=object_gn2[j].key;
        }
        else{
            if(min_gn_score2>object_gn2[j].key){
                min_gn_score2=object_gn2[j].key;
            }
            if(max_gn_score2<object_gn2[j].key){
                max_gn_score2=object_gn2[j].key;
            }
        }
    }

    
    demoGroup = "demographics" ;
    barChart = dc.barChart("#ageBar", demoGroup) ;
    barChart2 =dc.lineChart("#gnScore", demoGroup);

    pg_piechart =dc.pieChart("#pgg", demoGroup) ;
    ms_piechart =dc.pieChart("#mss", demoGroup) ;
    gen_piechart =dc.pieChart("#gen", demoGroup) ;

    vs_piechart =dc.pieChart("#vs", demoGroup) ;
    rv_piechart =dc.pieChart("#rv", demoGroup) ;
    nv_piechart =dc.pieChart("#nv", demoGroup) ;

    issuesChart = dc.rowChart("#issuesChart", demoGroup) ;
    viewsChart = dc.rowChart("#viewsChart", demoGroup) ;

    var chartHeights = 370 ;
    var chartWidth = 300;

    var transitionDuration = 200 ;

    barChart.width(810)
    .height(chartHeights)
    .margins({top: 10, right: 10, bottom: 10, left: 10})
    .dimension(dimAge)
    .group(nAge)
    .transitionDuration(transitionDuration)
    .x(d3.scale.linear().domain([10,100]))
    .xUnits(function(start, end, xDomain) { return 0.2*Math.abs(end-start) ; })
    .gap(1)
    .elasticY(true)
    .xAxisLabel("Age")
    .yAxis().ticks(4);

    barChart.on('filtered', function() {
        updateActiveFilters(barChart,barChart2,pg_piechart,ms_piechart,gen_piechart) ;
    });





    barChart2.width(805)
    .height(chartHeights)
    .margins({top: 10, right: 10, bottom: 20, left: 40})
    .dimension(dimScore)
    .group(ngn)
    .transitionDuration(500)
    .elasticY(true)
    .x(d3.scale.linear().domain([min_gn_score,max_gn_score]))
    .xUnits(function(start, end, xDomain) { return 0.2*Math.abs(end-start) ;; })
    .xAxis();

    barChart2.on('filtered', function() {
        updateActiveFilters(barChart,barChart2,pg_piechart,ms_piechart,gen_piechart) ;
    });



    pg_piechart.width(200)
    .height(200)
    .innerRadius(5)
    .dimension(dimpg)
        .group(nPg) // by default, pie charts will use group.key as the label
        .renderLabel(true)
        .label(function (d) {
            return d.data.key.toUpperCase();
        });

        pg_piechart.on('filtered', function() {
            updateActiveFilters(barChart,barChart2,pg_piechart,ms_piechart,gen_piechart) ;
        });


        ms_piechart.width(200)
        .height(200)
        .innerRadius(5)
        .dimension(dimMs)
        .group(nMs) // by default, pie charts will use group.key as the label
        .renderLabel(true)
        .label(function (d) {
            //console.log('label');
            //console.log(d);
            return d.data.key.toUpperCase();
        });
        ms_piechart.on('filtered', function() {
            updateActiveFilters(barChart,barChart2,pg_piechart,ms_piechart,gen_piechart) ;
        });

        gen_piechart.width(200)
        .height(200)
        .innerRadius(5)
        .dimension(dimGen)
        .group(nGen) // by default, pie charts will use group.key as the label
        .renderLabel(true)
        .label(function (d) {
            return d.data.key.toUpperCase();
        });
        gen_piechart.on('filtered', function() {
            updateActiveFilters(barChart,barChart2,pg_piechart,ms_piechart,gen_piechart) ;
        });


        vs_piechart.width(200)
        .height(200)
        .innerRadius(5)
        .dimension(dimvs)
        .group(nvs) // by default, pie charts will use group.key as the label
        .renderLabel(true)
        .label(function (d) {
            return d.data.key.toUpperCase();
        });

        vs_piechart.on('filtered', function() {
            updateActiveFilters(barChart,barChart2,pg_piechart,ms_piechart,gen_piechart) ;
        });

        rv_piechart.width(200)
        .height(200)
        .innerRadius(5)
        .dimension(dimrv)
        .group(nrv) // by default, pie charts will use group.key as the label
        .renderLabel(true)
        .label(function (d) {
            //console.log('label');
            //console.log(d);
            return d.data.key.toUpperCase();
        });

        rv_piechart.on('filtered', function() {
            updateActiveFilters(barChart,barChart2,pg_piechart,ms_piechart,gen_piechart) ;
        });

        nv_piechart.width(200)
        .height(200)
        .innerRadius(5)
        .dimension(dimnv)
        .group(nnv) // by default, pie charts will use group.key as the label
        .renderLabel(true)
        .label(function (d) {
            return d.data.key+" Participation" ;
        });

        nv_piechart.on('filtered', function() {
            updateActiveFilters(barChart,barChart2,pg_piechart,ms_piechart,gen_piechart) ;
        });


        issuesChart.width(405)
        .height(chartHeights)
        .margins({top: 10, right: 10, bottom: 30, left: 10})
        .dimension(dimIssue)
        .group(nIssue)
        .transitionDuration(transitionDuration)
        .label(function (d) { return d.key.toUpperCase().replaceAll("_", " "); } )
        .colors(d3.scale.category20())
        .elasticX(true)
        .xAxis().ticks(4) ;

        issuesChart.on('filtered', function() {
            updateActiveFilters(barChart,barChart2,pg_piechart,ms_piechart,gen_piechart) ;
        });



        viewsChart.width(405)
        .height(chartHeights)
        .margins({top: 10, right: 10, bottom: 30, left: 10})
        .dimension(dimView)
        .group(f_nView)
        .transitionDuration(transitionDuration)
               .label(function (d) { return d.key.toUpperCase().replaceAll("_", " "); } ) //views[d.key]
               .colors(d3.scale.category20())
               .elasticX(true)
               .xAxis().ticks(4) ;

               viewsChart.on('filtered', function() {
                   updateActiveFilters(barChart,barChart2,pg_piechart,ms_piechart,gen_piechart) ;
               });


               $("#ageReset").on("click", function() {
                barChart.filterAll() ;
                dc.redrawAll(demoGroup) ;
            }) ;
               $("#gnReset").on("click", function() {
                barChart2.filterAll() ;
                dc.redrawAll(demoGroup) ;
            }) ;

               $("#genReset").on("click", function() {
                gen_piechart.filterAll() ;
                dc.redrawAll(demoGroup) ;
            }) ;
               $("#msReset").on("click", function() {
                ms_piechart.filterAll() ;
                dc.redrawAll(demoGroup) ;
            }) ;
               $("#pgReset").on("click", function() {
                pg_piechart.filterAll() ;
                dc.redrawAll(demoGroup) ;
            }) ;

               $("#vsReset").on("click", function() {
                vs_piechart.filterAll() ;
                dc.redrawAll(demoGroup) ;
            }) ;

               $("#rvReset").on("click", function() {
                rv_piechart.filterAll() ;
                dc.redrawAll(demoGroup) ;
            }) ;

               $("#issuesReset").on("click", function() {
                issuesChart.filterAll() ;
                dc.redrawAll(demoGroup) ;
            }) ;

               $("#viewsReset").on("click", function() {
                viewsChart.filterAll() ;
                dc.redrawAll(demoGroup) ;
            }) ;


               updateActiveFilters(barChart,barChart2,pg_piechart,ms_piechart,gen_piechart) ;
}


function remove_empty_bins(source_group) {
    return {
        all:function () {
            return source_group.all().filter(function(d) {
                return d.key != 0;
            });
        }
    };
}


function updateActiveFilters(barChart, barChart2,pg_peichart,ms_peichart,gen_peichart) {

            var text = "Filters: " ;

            if (barChart.filters().length > 0) {
                text += "<br>Filter1 Between <b>" + barChart.filters()[0][0].toPrecision(2) + "</b> and <b>" + Math.round(barChart.filters()[0][1].toPrecision(3)) + "</b> years old";
            }


            if (barChart2.filters().length > 0) {
                text += "<br>Filter2 Between <b>" + barChart2.filters()[0][0].toPrecision(2) + "</b> and <b>" + barChart2.filters()[0][1].toPrecision(2) ;
            }


            if (pg_peichart.filters().length > 0) {
                text += "<br>Filter3  " + pg_peichart.filters().map(function(d) { return "<b>"+[d]+"</b>" ; }).join(" , ") ;
            }
            if (ms_peichart.filters().length > 0) {
                text += "<br>Filter4  " + ms_peichart.filters().map(function(d) { return "<b>"+[d]+"</b>" ; }).join(" , ") ;
            }
            if (gen_peichart.filters().length > 0) {
                text += "<br>Filter5  " + gen_peichart.filters().map(function(d) { return "<b>"+[d]+"</b>" ; }).join(" , ") ;
            }
            if (issuesChart.filters().length > 0) {
                text += "<br>Filter6 " + issuesChart.filters().map(function(d) {  return "<b>"+ d+"</b>" ; }).join(" or ") ;
            }
            if (viewsChart.filters().length > 0) {
                text += "<br>Filter7 " + viewsChart.filters().map(function(d) { return "<b>"+ d+"</b>" ; }).join(" or ") ;
            }

            if (vs_piechart.filters().length > 0) {
                text += "<br>Filter8  " + vs_piechart.filters().map(function(d) { return "<b>"+[d]+"</b>" ; }).join(" , ") ;
            }
            if (rv_piechart.filters().length > 0) {
                text += "<br>Filter9  " + rv_piechart.filters().map(function(d) { return "<b>"+[d]+"</b>" ; }).join(" , ") ;
            }

            text += "."
            $("#activeFilterValue").html(text) ;
        }