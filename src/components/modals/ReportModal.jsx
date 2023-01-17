import { useState } from "react";
import { ErrorHandler, Message } from "../../utils/message";
import { ReportItemAPi } from './../../container/Api/api'
const $ = window.jQuery
export default function ReportModal({ Data, Logo, productId }) {
  const [let_us_know_why, setLet_us_know_why] = useState('')
  const [product_report_abuse_id, setProduct_report_abuse_id] = useState()
  const [reportItem, setReportItem] = useState('')
  const [errors, setErrors] = useState('');


  const handleChange = (e) => {
    setLet_us_know_why(e.target.value)
    setErrors('');
    $('.report-item').on('hidden.bs.modal', function () {
      $('#v-pills-second').removeClass('active show');
      $('#v-pills-first').addClass('active show');
      $('#v-pills-v-tab').prop('aria-selected', false).removeClass('active');
    });
  }

  const handleChangeAbuse = (e, item) => {
    setProduct_report_abuse_id(e.target.value)
    setReportItem(item)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!let_us_know_why) {
      setErrors('Please provide the reason')
    } else if (!product_report_abuse_id) {
      setErrors('Please select a reason')
    } else {
      let body = {
        user_id: localStorage.getItem('id'),
        product_id: productId,
        product_report_abuse_id,
        let_us_know_why
      }
      let res = await ReportItemAPi(body)
      try {
        if (res.data.status === 1) {
          let message = res.data.message
          Message('success', 'Success', message)
          $('.report-item').hide();
          $('body').removeClass('modal-open');
          $('body').css('padding-right', '0px');
          $('.modal-backdrop').remove();
        } else if (res.data.status === 0) {
          let error = res.data.message;
          Message('error', 'Error', error)
        }
      } catch (err) {
        ErrorHandler(err)
      }
    }
  }

  return (
    <div className='modal fade report-item' tabIndex={-1} role='dialog' aria-labelledby='myLargeModalLabel' aria-hidden='true'>
      <div className='modal-dialog modal-md modal-dialog-centered'>
        <div className='modal-content'>
          <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
            <span aria-hidden='true'>×</span>
          </button>
          <div className='report-issues-list'>
            <div className='modal-title'>
              <h4>I am reporting this item for...</h4>
            </div>
            <form>
              <div className='tab-content' id='v-pills-tabContent'>
                <div className='tab-pane fade show active' id='v-pills-first' role='tabpanel' aria-labelledby='v-pills-first-tab'>
                  {Data && Object.keys(Data).length !== 0 ? Data.map((item, i) => {
                    return <div className='form-check' key={i}>
                      <label className='form-check-label'>
                        <input className='form-check-input' type='radio' name='product_report_abuse_id'
                          value={item.id} onChange={(e) => handleChangeAbuse(e, item)} />

                        <span>{item.title}</span>
                        <p>{item.description}</p>
                      </label>
                    </div>
                  }) : ''}
                  <button id='v-pills-v-tab' data-toggle='pill' href='#v-pills-second' role='tab' aria-controls='v-pills-second' aria-selected='false' type='submit' className='btn-default hvr-bounce-in'><span className='icon'>
                    <img className='img-fluid' src={Logo} alt='OlympusNFT Logo' />
                  </span> Next</button>
                </div>
                <div className='tab-pane fade' id='v-pills-second' role='tabpanel' aria-labelledby='v-pills-second-tab'>
                  {reportItem ? <div className='form-check'>
                    <input className='form-check-input' type="checkbox" checked value={product_report_abuse_id}
                      name='product_report_abuse_id' id='issue1' />
                    <label className='form-check-label'>
                      <span>{reportItem.title}</span>
                      <p>{reportItem.description}</p>
                    </label>
                  </div> : ''}
                  <div className='form-group'>
                    <textarea className='form-control' onChange={handleChange} value={let_us_know_why} id='exampleFormControlTextarea1' rows={3} />
                  </div>
                  <button type='submit' onClick={handleSubmit} className=' btn-default hvr-bounce-in'> <span className='icon'>
                    <img className='img-fluid' src={Logo} alt='OlympusNFT Logo' />
                  </span>Next</button>
                </div>
                {errors ? <span className='alert alert-danger m-auto'>{errors}</span> : ''}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
