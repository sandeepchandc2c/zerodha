import React from "react";

function Orders() {
    return (
  <div class="card">
    <h3 class="card-header text-center font-weight-bold text-uppercase py-4">
      Editable table
    </h3>
    <div class="card-body">
      <div id="table" class="table-editable">
        <span class="table-add float-right mb-3 mr-2"
          ><a href="#!" class="text-success"
            ><i class="fas fa-plus fa-2x" aria-hidden="true"></i></a
        ></span>
        <table class="table table-bordered table-responsive-md table-striped text-center">
          <thead>
            <tr>
              <th class="text-center">SYMBOL</th>
              <th class="text-center">Type</th>
              <th class="text-center">Order_Type</th>
              <th class="text-center">Trigger_Price</th>
              <th class="text-center">Validity</th>
              <th class="text-center">Product</th>
              <th class="text-center">variety</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="pt-3-half" contenteditable="true">Aurelia Vega</td>
              <td class="pt-3-half" contenteditable="true">30</td>
              <td class="pt-3-half" contenteditable="true">Deepends</td>
              <td class="pt-3-half" contenteditable="true">Spain</td>
              <td class="pt-3-half" contenteditable="true">Madrid</td>
              <td class="pt-3-half">
                 Product
              </td>
              <td>
                Variety
              </td>
            </tr> 
          </tbody>
        </table>
      </div>
    </div>
  </div>
    );
  }
  
export default Orders;
  