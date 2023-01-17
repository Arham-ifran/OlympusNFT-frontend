import { Link } from 'react-router-dom'
import AlreadyImage from './../../assets/img/already.svg'
import CreateImage from './../../assets/img/create.svg'

export default function CreateItemModal({ Open, Display, handleModal, handleDisplay }) {

  return (
    <div className={Open ? 'modal fade create-item show' : 'modal fade create-item'}
      style={Open ? { display: 'block' } : { display: 'none' }}>
      <div className='modal-dialog modal-lg modal-dialog-centered'>
        <div className='modal-content'>
          <button type='button' className='close' onClick={handleModal}>
            <span aria-hidden='true'>×</span>
          </button>
          <div className='tab-content' id='v-pills-tabContent'>
            <div className={!Display ? 'tab-pane fade show active' : 'tab-pane fade'} >
              <div className='modal-title'>
                <h4>DOES YOUR ITEM ALREADY EXIST?</h4>
                <p>Is the item live on the blockchain or is it a new item you want to make?</p>
              </div>
              <div className='product-options'>
                <div className='option'>
                  <div className='image'>
                    <img src={AlreadyImage} alt='' className='img-fluid' />
                  </div>
                  <p>The NFT is already in my wallet</p>
                </div>

                <div className='option' >
                  <div className='image' onClick={handleDisplay}>
                    <img src={CreateImage} alt='' className='img-fluid' />
                  </div>
                  <Link to='/create-item'><p>Create a new item </p></Link>
                </div>
              </div>
            </div>
            <div className={Display ? 'tab-pane fade show active' : 'tab-pane fade'}>
              <div className='modal-title'>
                <h4>Traditional or gasless?</h4>
              </div>
              <div className='product-options'>
                <Link to='/create-item' className='option'>
                  <span className='color'>Create a new item</span>
                  <div className='image'>
                    <img src={CreateImage} alt='' className='img-fluid' />
                  </div>
                  <p>No transaction fee - completely free</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
