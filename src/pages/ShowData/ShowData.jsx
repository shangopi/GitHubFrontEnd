import Papa from "papaparse";
import "./ShowData.css";
import React, { useState, useRef, useEffect } from "react";
import Navbar from "../../components/Navbar/Nav";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { saveXdata, saveYdata, saveArcdata } from "../../redux/csvhandler";
import BarCustomize from "../ChartPages/BarCustomize";
import AreaCustomize from "../ChartPages/AreaCustomize";
import BubbleCustomize from "../ChartPages/BubbleCustomize";
import Chord_Customize from "../ChartPages/Chord_Customize";
import LineCustomize from "../ChartPages/LineCustomize";
import PieCustomize from "../ChartPages/PieCustomize";
import PolarAreaCustomization from "../ChartPages/PolarAreaCustomization";
import RadarCustomize from "../ChartPages/RadarCustomize";
import ScatterCustomize from "../ChartPages/ScatterCustomize";
import Arc_Customize from "../ChartPages/Arc_Customize";
import { useNavigate } from "react-router-dom";
import jwtdecode from "jwt-decode";

const chartsFromChartJs = ["area", "bar", "line", "pie", "polar", "radar"];

const chartScatter = ["scatter"];

const chartBubble = ["bubble"];

const chartFromArc = ["arc", "chord"];
// var chartType;

const ShowData = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  console.log("Location is: ", location.state?.file);
  const localfile = location.state?.file;

  const csvFile = window.URL.createObjectURL(location.state?.file);

  console.log("Data is: ", csvFile);
  console.log(csvFile);
  const chart = useSelector((state) => state.csvhandler.charttype);
  console.log(chart);

  const [text, setText] = useState([]); //all the labels for x axis
  const [textY, setTextY] = useState([]); //all the lables for Yaxis
  const [tableData, setTableData] = useState([]); //all the data in array format  [[],[],[]]
  const [xVariable, setXVariable] = useState("X"); // Chosen label for Xaxis
  const [sourceNode, setSourceNode] = useState("Source Node");
  const [targetNode, setTargetNode] = useState("Target Node");
  const [weight, setWeight] = useState(
    <div style={{ padding: "15px", fontSize: "15px" }}>
      Should be a Data Set of Numerical Values !!!{" "}
    </div>
  );
  const [yVariable, setYVariable] = useState("Y"); //Chosen labels in the Yaxis
  const [rVariable, setRvariable] = useState("R");
  const [dragging, setDragging] = useState(false);
  const dragItem = useRef();
  const dragNode = useRef();
  const [x_axis, setX_axis] = useState([]); // [label:[values]]    Data column for the chosen label
  const [y_axis, setY_axis] = useState([]); // [label1:[values1],label2:[values2]]   Data columns for the chosen labels
  const [r_axis, setR_axis] = useState([]);
  const [arcData, setArcData] = useState([]); // [[sourceNode1,TargetNode1,weight1],[sourceNode2,TargetNode2,weight2],[sourceNode3,TargetNode3,weight3]]
  const [showCustomize, setShowCustomize] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [inputTitle, setInputTitle] = useState("");
  let chartdataarray = [];
  const navigate = useNavigate();
  const arr = [];
  //const arr=[];
  // var count;
  var chartType;

  if (chartsFromChartJs.includes(chart)) {
    chartType = "ChartJs";
  } else if (chartFromArc.includes(chart)) {
    chartType = "ArcChart";
  } else if (chartScatter.includes(chart)) {
    chartType = "Scatter";
  } else if (chartBubble.includes(chart)) {
    chartType = "Bubble";
  }
  //var chartType ='ArcChart'
  const [checkBool, setCheckBool] = useState(false);

  useEffect(() => {
    fetch(csvFile)
      .then((response) => response.text())
      .then((responseText) => {
        // -- parse csv

        var data = Array(Papa.parse(responseText));
        var out = data[0]["data"];
        //var textY_arr = [];
        setText(out[0]);
        setTableData(out.slice(1, out.length - 1));
        // label_a.map((va, vai) => { //No of coloumns = label_a.length
        //   var state = true;
        //   for (var i = 0; i < data_a.length; i++) {           //No of rows = data_a.length
        //     if (isNaN(data_a[i][vai])) {
        //       state = false;
        //       break;
        //     }
        //   }
        //   if (state === true) {
        //     textY_arr.push(va);
        //   }
        // });
        //setTextY(textY_arr);
        const token = localStorage.getItem("token");
        if (token) {
          const user = jwtdecode(token);
          console.log("The token ", user);
          if (!user) {
            localStorage.removeItem("token");
          } else {
            const user = jwtdecode(token);
            setEmail(user.email);
            console.log("User is here");
            setIsLogged(true);
          }
        }
      });
  }, []);

  async function saveChart() {
    const response = await fetch("http://localhost:4001/api/chart/saveChart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email,
        title,
        chart,
        chartdataarray,
      }),
    });
    const data = await response.json();
  }

  // const load = async function(){
  //     await fetch( csvFile )
  // .then( response =>  response.text() )
  // .then( responseText => {
  //     // -- parse csv
  //     var data =Array(Papa.parse(responseText));
  //     var out=data[0]['data'];
  //     setText(out[0]);
  //     setTableData(out.slice(1,out.length-1));
  //     console.log('data:', (text));
  // })
  // };

  //passes "x" or "Y" and column number
  //1st text use state has to be loaded
  const arrayPush = function (axis) {
    const arr = [];
    const arrx = [];
    const arry = [];
    const arrr = [];
    var j;
    var k;
    if (axis === "x") {
      j = text.indexOf(xVariable);
      k = text.indexOf(yVariable);
      const sub_arrx = [];
      const sub_arry = [];
      tableData.map((row) => {
        sub_arrx.push(row[j]);
        sub_arry.push(row[k]);
      });
      arrx[xVariable] = sub_arrx;
      arry[yVariable] = sub_arry;
      setY_axis(arry);
      setX_axis(arrx);
      console.log("XARrAY", arrx);
      console.log("Yarray", arry);
    } else if (axis === "r") {
      j = text.indexOf(xVariable);
      k = text.indexOf(yVariable);
      l = text.indexOf(rVariable);
      const sub_arr = [];
      tableData.map((row) => {
        sub_arr.push({ x: row[j], y: row[k], r: row[l] });
      });
      console.log("R ARRAY", sub_arr);
      setR_axis(sub_arr);
    } else if ((axis = "A")) {
      var l = text.indexOf(sourceNode);
      var m = text.indexOf(targetNode);
      var n = text.indexOf(weight);
      tableData.map((row) => {
        arr.push([row[l], row[m], row[n]]);
      });
      console.log(arr);
      setArcData(arr);
    }
  };

  const load = () => {
    if (chartType === "ChartJs" || chartType === "Scatter") {
      arrayPush("x");
    } else if (chartType === "ArcChart") {
      arrayPush("A");
    } else if (chartType === "Bubble") {
      arrayPush("r");
    }
    setShowCustomize(true);
    console.log("Im hereeee");
  };

  const check = (variable, k, t) => {
    var j = text.indexOf(variable);
    var c = 0;
    var x = xVariable;
    var y = yVariable;
    var r = rVariable;
    for (var i = 0; i < tableData.length; i++) {
      if (isNaN(tableData[i][j])) {
        if (k === 0) {
          setWeight(
            <div
              style={{
                wordWrap: "break-word",
                backgroundColor: "#dcdfe6",
                color: "#e63232",
                fontSize: "12px",
                padding: "15px",
              }}
            >
              This Data Set ({variable}) contains strings.. Please select
              another{" "}
            </div>
          );
        } else if (k === 1) {
          if (t === "y" || t === "yy") {
            setYVariable(
              <div
                style={{
                  wordWrap: "break-word",
                  backgroundColor: "#dcdfe6",
                  color: "#e63232",
                  fontSize: "12px",
                  padding: "15px",
                }}
              >
                This Data Set ({variable}) contains strings.. Please select
                another{" "}
              </div>
            );
            y = (
              <div
                style={{
                  wordWrap: "break-word",
                  backgroundColor: "#dcdfe6",
                  color: "#e63232",
                  fontSize: "12px",
                  padding: "15px",
                }}
              >
                This Data Set ({variable}) contains strings.. Please select
                another{" "}
              </div>
            );
          } else if (t === "x") {
            setXVariable(
              <div
                style={{
                  wordWrap: "break-word",
                  backgroundColor: "#dcdfe6",
                  color: "#e63232",
                  fontSize: "12px",
                  padding: "15px",
                }}
              >
                This Data Set ({variable}) contains strings.. Please select
                another{" "}
              </div>
            );
            x = (
              <div
                style={{
                  wordWrap: "break-word",
                  backgroundColor: "#dcdfe6",
                  color: "#e63232",
                  fontSize: "12px",
                  padding: "15px",
                }}
              >
                This Data Set ({variable}) contains strings.. Please select
                another{" "}
              </div>
            );
          } else if (t === "yyr") {
            setRvariable(
              <div
                style={{
                  wordWrap: "break-word",
                  backgroundColor: "#dcdfe6",
                  color: "#e63232",
                  fontSize: "12px",
                  padding: "15px",
                }}
              >
                This Data Set ({variable}) contains strings.. Please select
                another{" "}
              </div>
            );
            r = x = (
              <div
                style={{
                  wordWrap: "break-word",
                  backgroundColor: "#dcdfe6",
                  color: "#e63232",
                  fontSize: "12px",
                  padding: "15px",
                }}
              >
                This Data Set ({variable}) contains strings.. Please select
                another{" "}
              </div>
            );
          }
        }

        c += 1;
        return false;
      }
    }

    if (c === 0) {
      if (k === 0) {
        setWeight(variable);
      } else if (k === 1) {
        if (t == "x") {
          setXVariable(variable);
          x = variable;
        } else if (t === "y" || t === "yy") {
          setYVariable(variable);
          y = variable;
        } else if (t === "yyr") {
          setRvariable(variable);
          r = variable;
        }
      }
      if (t === "x" || (t === "yy") | (t === "yyr")) {
        const s_one = (
          <div
            style={{
              wordWrap: "break-word",
              backgroundColor: "#dcdfe6",
              color: "#e63232",
              fontSize: "12px",
              padding: "15px",
            }}
          >
            This Data Set ({variable}) contains strings.. Please select another{" "}
          </div>
        );
        console.log("xxxxx:", x, " yyyyyy:", y);
        if (chartType === "Bubble") {
          if (text.includes(x) && text.includes(y) && text.includes(r)) {
            console.log("Inside step1");
            return true;
          } else {
            console.log("Inside step2");
            return false;
          }
        }
        if (text.includes(x) && text.includes(y)) {
          console.log("Inside step3");
          return true;
        } else {
          console.log("Inside step4");
          return false;
        }
      }
      console.log("Inside step5");
      return true;
    }
  };

  const fullfill = () => {
    var b =
      sourceNode === "Source Node" ||
      targetNode === "Target Node" ||
      weight ===
      (
        <div style={{ padding: "15px", fontSize: "15px" }}>
          Should be a Data Set of Numerical Values !!!{" "}
        </div>
      );
    return b;
  };

  const handleDragStart = (e, params) => {
    console.log("drag starting", params);
    dragItem.current = params;
    dragNode.current = e.target;
    dragNode.current.addEventListener("dragend", handleDragEnd);
    setTimeout(() => {
      setDragging(true);
    }, 0);
  };

  const handleDragEnter = (e, params, i, t) => {
    console.log("Enteringg drag", params);
    const currentItem = dragItem.current;
    const variable = text[currentItem["variNameI"]];
    // const y_variable = text[currentItem["variNameI"]];
    setShowCustomize(false);
    if (params === "X") {
      if (i === 0) {
        setXVariable(variable);
      } else if (i === 1) {
        setSourceNode(variable);
      } else if (i === 2) {
        setTargetNode(variable);
      } else if (i === 3) {
        var bool = check(variable, 0);
        console.log("State : ", bool);
        setCheckBool(bool);
      }
    } else if (params === "Y") {
      var bool = check(variable, 1, t);
      console.log("State : ", bool);
      setCheckBool(bool);
      //setYVariable(text[currentItem["variNameI"]]);
      // console.log("current item is",text[currentItem["variNameI"]]);
      // arrayPush('y',currentItem["variNameI"]);
      // console.log("Array",y_axis);
    }
    // if(e.target !== dragNode.current){
    //     console.log("Target is not the same");
    //     setList(oldList=>{
    //         let newList = JSON.parse(JSON.stringify(oldList));
    //         newList[params.grpI].items.splice(params.itemI,0,newList[currentItem.grpI].items.splice(currentItem.itemI,1)[0]);
    //         dragItem.current = params;
    //         return newList;
    //     })
    // }
  };

  const handleDragEnd = () => {
    console.log("Ending Drag");
    setDragging(false);
    dragNode.current.removeEventListener("dragend", handleDragEnd);
    dragItem.current = null;
    dragNode.current = null;
  };

  const getStyles = (params, i) => {
    if (dragItem.current.variNameI === params.variNameI && i == 0) {
      return "current dnd-item";
    } else if (dragItem.current.varNameI === params.varNameI && i == 1) {
      return "current dnd-item";
    }
    return "dnd-item";
  };

  const show = function () {
    switch (chart) {
      case "bar":
        chartdataarray = [x_axis[xVariable], yVariable, y_axis[yVariable]];
        return (
          <BarCustomize
            xlabel={x_axis[xVariable]}
            dataset={yVariable}
            dataarray={y_axis[yVariable]}
          />
        );
      case "bubble":
        chartdataarray = [yVariable, r_axis];
        return <BubbleCustomize dataset={yVariable} dataarray={r_axis} />;
      case "line":
        chartdataarray = [x_axis[xVariable], yVariable, y_axis[yVariable]];
        return (
          <LineCustomize
            xlabel={x_axis[xVariable]}
            dataset={yVariable}
            dataarray={y_axis[yVariable]}
          />
        );
      case "pie":
        chartdataarray = [x_axis[xVariable], yVariable, y_axis[yVariable]];
        return (
          <PieCustomize
            xlabel={x_axis[xVariable]}
            dataset={yVariable}
            dataarray={y_axis[yVariable]}
          />
        );
      case "ploarArea":
        chartdataarray = [x_axis[xVariable], yVariable, y_axis[yVariable]];
        return (
          <PolarAreaCustomization
            xlabel={x_axis[xVariable]}
            dataset={yVariable}
            dataarray={y_axis[yVariable]}
          />
        );
      case "radar":
        chartdataarray = [x_axis[xVariable], yVariable, y_axis[yVariable]];
        return (
          <RadarCustomize
            xlabel={x_axis[xVariable]}
            dataset={yVariable}
            dataarray={y_axis[yVariable]}
          />
        );
      case "scatter":
        chartdataarray = [x_axis[xVariable], yVariable, y_axis[yVariable]];
        return (
          <ScatterCustomize
            xlabel={x_axis[xVariable]}
            dataset={yVariable}
            dataarray={y_axis[yVariable]}
          />
        );
      case "area":
        chartdataarray = [x_axis[xVariable], yVariable, y_axis[yVariable]];
        return (
          <AreaCustomize
            xlabel={x_axis[xVariable]}
            dataset={yVariable}
            dataarray={y_axis[yVariable]}
          />
        );
      case "arc":
        chartdataarray = arcData;
        return <Arc_Customize data_array={arcData} />;
      case "chord":
        chartdataarray = arcData;
        return <Chord_Customize data_array={arcData} />;
    }
  };
  function logOut() {
    localStorage.removeItem("token");
    setIsLogged(false);
  }

  async function checkSizeTitle() {
    if (title.length > 0) {
      //setTitle(inputTitle)
      //setInputTitle('')
      await saveChart();
      setTitle("");
    } else {
      alert("Enter a Title");
    }
  }

  return (
    <>
      <Navbar />
      {/* <button onClick={ load }>load</button>
            <h2>text:</h2> */}
      <div style={{ margin: "50px" }}>
        <h2>CSV Data Table</h2>
      </div>
      <div
        style={{
          overflow: "auto",
          marginLeft: "10%",
          marginRight: "10%",
          marginTop: "5%",
          height: "500px",
          border: "20px solid rgb(177, 188, 213)",
        }}
      >
        <thead className="csvtable">
          <tr className="csvtr">
            {text.map((va, vai) => {
              // var state = true;
              // for (var i = 0; i < tableData.length; i++) {           //No of rows = data_a.length
              //   if (isNaN(tableData[i][vai])) {
              //     state = false;
              //     break;
              //   }
              // }
              // if (state === true ) {
              //   arr.push(va);
              // }
              return <th className="csvth">{va}</th>;
            })}
          </tr>
        </thead>
        <tbody className="csvtable">
          {tableData.map((row) => (
            <tr className="csvtr">
              {row.map((ele) => (
                <td className="csvtd">{ele}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </div>
      <div
        style={{ marginTop: "5%", margin: "10%", backgroundColor: "#d1d1f0" }}
      >
        <div style={{ paddingTop: "70px", margin: "50px" }}>
          {chartType === "ChartJs" && (
            <h2>Chose Your Independent Variable and Dependent Variable </h2>
          )}
          {chartType === "ArcChart" && (
            <h2>Chose Your Source,Target and Weight Nodes </h2>
          )}
          {chartType === "Bubble" && (
            <h2>Chose Your X & Y Axises and the Radius </h2>
          )}
          {chartType === "Scatter" && <h2>Chose Your X & Y Axises</h2>}
        </div>
        <div
          className="drag-n-drop"
          style={{ margin: "5%", backgroundColor: "#dfe4f7" }}
        >
          <div
            className="dnd-group scrollable"
            style={{ float: "left", width: "30%", marginLeft: "10%" }}
          >
            <div className="group-title">Item</div>
            {text.map((variName, variNameI) => {
              return (
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, { variNameI })}
                  onDragEnter={
                    dragging
                      ? (e) => {
                          handleDragEnter(e, { variNameI });
                        }
                      : null
                  }
                  key={variNameI}
                  className={
                    dragging ? getStyles({ variNameI }, 0) : "dnd-item"
                  }
                >
                  {variName}
                </div>
              );
            })}
          </div>
          {(chartType === "ChartJs" ||
            chartType === "Scatter" ||
            chartType === "Bubble") && (
            <div
              style={{
                float: "right",
                width: "30%",
                marginTop: "2%",
                marginBottom: "2%",
                marginRight: "15%",
              }}
            >
              <div>
                <div className="dnd-group">
                  <div className="group-title">X-Axis</div>
                  <div
                    draggable
                    onDragEnter={
                      dragging
                        ? (e) => {
                            if (chartType === "ChartJs") {
                              handleDragEnter(e, "X", 0, "l");
                            } else if (
                              chartType === "Scatter" ||
                              chartType === "Bubble"
                            ) {
                              handleDragEnter(e, "Y", 0, "x");
                            }
                          }
                        : null
                    }
                    className="dnd-item"
                  >
                    {xVariable}
                  </div>
                </div>
              </div>
              <div>
                <div className="dnd-group">
                  <div className="group-title">Y-Axis</div>
                  <div
                    draggable
                    onDragEnter={
                      dragging
                        ? (e) => {
                            if (chartType === "ChartJs") {
                              handleDragEnter(e, "Y", 0, "y");
                            } else if (
                              chartType === "Scatter" ||
                              chartType === "Bubble"
                            ) {
                              handleDragEnter(e, "Y", 0, "yy");
                            }
                          }
                        : null
                    }
                    className="dnd-item"
                  >
                    {yVariable}
                  </div>
                </div>
              </div>
              {chartType === "Bubble" && (
                <div>
                  <div className="dnd-group">
                    <div className="group-title">Radius</div>
                    <div
                      draggable
                      onDragEnter={
                        dragging
                          ? (e) => {
                              handleDragEnter(e, "Y", 0, "yyr");
                            }
                          : null
                      }
                      className="dnd-item"
                    >
                      {rVariable}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {chartType === "ArcChart" && (
            <div style={{ float: "right", width: "30%", marginRight: "15%" }}>
              <div>
                <div className="dnd-group">
                  <div className="group-title">Source Node</div>
                  <div
                    draggable
                    onDragEnter={
                      dragging
                        ? (e) => {
                            handleDragEnter(e, "X", 1);
                          }
                        : null
                    }
                    className="dnd-item"
                  >
                    {sourceNode}
                  </div>
                </div>
              </div>

              <div>
                <div className="dnd-group">
                  <div className="group-title">Target Node</div>
                  <div
                    draggable
                    onDragEnter={
                      dragging
                        ? (e) => {
                            handleDragEnter(e, "X", 2);
                          }
                        : null
                    }
                    className="dnd-item"
                  >
                    {targetNode}
                  </div>
                </div>
              </div>

              <div>
                <div className="dnd-group">
                  <div className="group-title">Weight</div>
                  <div
                    draggable
                    onDragEnter={
                      dragging
                        ? (e) => {
                            handleDragEnter(e, "X", 3);
                          }
                        : null
                    }
                    className="dnd-item"
                  >
                    {weight}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {(chartType === "ChartJs" ||
          chartType === "Scatter" ||
          chartType == "Bubble") &&
          (xVariable === "X" || yVariable === "Y" || !checkBool) && (
            <div style={{ margin: "50px", paddingBottom: "50px" }}>
              <h3 style={{ color: "red" }}>
                Fill x axis and y axis with variables
              </h3>
            </div>
          )}
        {(chartType === "ChartJs" ||
          chartType === "Scatter" ||
          chartType == "Bubble") &&
          checkBool &&
          !(xVariable === "X" || yVariable === "Y") && (
            <div style={{ margin: "50px", paddingBottom: "50px" }}>
              {/* <Link
                style={{ textDecoration: "none" }}
                to={{ pathname: { pathname } }}
              > */}
              <button
                className="showbutton"
                onClick={() => {
                  load();
                  // dispatch(saveXdata(x_axis));
                  // dispatch(saveYdata(y_axis));
                }}
              >
                proceed
              </button>
              {/* </Link> */}
            </div>
          )}
        {console.log(checkBool)}
        {chartType === "ArcChart" && (!checkBool || fullfill()) && (
          <div style={{ margin: "50px", paddingBottom: "50px" }}>
            <h3 style={{ color: "red" }}>
              Give a source node, target node and the weight
            </h3>
          </div>
        )}
        {chartType === "ArcChart" && checkBool && !fullfill() && (
          <div style={{ margin: "50px", paddingBottom: "50px" }}>
            {/* <Link
              style={{ textDecoration: "none" }}
              to={{ pathname: { pathname } }}
            > */}
            <button
              className="showbutton"
              onClick={() => {
                load();
                //   dispatch(saveArcdata(arcData));
              }}
            >
              Proceed
            </button>
            {/* </Link> */}
          </div>
        )}
      </div>
      <div>
        {console.log("customixee:", showCustomize)}
        {showCustomize == true && show()}
        {/* <BarCustomize xlabel={x_axis[xVariable]} dataset={yVariable[0]} dataarray={y_axis[yVariable[0]]}/>}  */}
        {/* {showCustomize==true && <BarCustomize/>}  */}
      </div>
      {isLogged && showCustomize && (
        <div>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button
            onClick={() => {
              checkSizeTitle();
            }}
          >
            Save
          </button>
        </div>
      )}
      {isLogged && (
        <div>
          <form onSubmit={logOut}>
            <input type="submit" value="Log Out" />
          </form>
        </div>
      )}
    </>
  );
};

export default ShowData;
