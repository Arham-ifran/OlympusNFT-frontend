export default function MoonPayModal(props) {

  return (
    <><div className={`modal fade transfer buy-busd`} tabIndex={-1} role='dialog' aria-labelledby='myLargeModalLabel' aria-hidden='true'>
      <div className='modal-dialog modal-lg  modal-dialog-centered'>
        <div className='modal-content'>
          <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
            <span aria-hidden='true'>×</span>
          </button>
          <div className='modal-title'>
            <h4>Add Funds</h4>
          </div>
          <div className='seller-info'>
            <iframe
              allow="accelerometer; autoplay; camera; gyroscope; payment"
              frameBorder="0"
              height="450"
              src="https://buy-staging.moonpay.io?apiKey=pk_test_xKRMFO3lt8Tid0JrAPlGGxxAkCoLnPdLA&currencyCode=busd"
              width="100%"
            ><p>Your browser does not support iframes.</p></iframe>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
