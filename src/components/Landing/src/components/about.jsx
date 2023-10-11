export const About = (props) => {
  return (
    <div id='about'>
      <div className='container'>
        <div className='row'>
          <div className='col-xs-12 col-md-6'>
            {' '}
            <img src='https://img.freepik.com/free-vector/man-search-hiring-job-online-from-laptop_1150-52728.jpg?w=826&t=st=1696926665~exp=1696927265~hmac=78f2ec25d3f91f20dddfcd8a049e72495851f207144af003a3674e396418f210' className='img-responsive' alt='' />{' '}
          </div>
          <div className='col-xs-12 col-md-6'>
            <div className='about-text'>
              <h2>About Us</h2>
              <p>{props.data ? props.data.paragraph : 'loading...'}</p>
              <h3>Why Choose Us?</h3>
              <div className='list-style'>
                <div className='col-lg-6 col-sm-6 col-xs-12'>
                  <ul>
                    {props.data
                      ? props.data.Why.map((d, i) => (
                          <li key={`${d}-${i}`}>{d}</li>
                        ))
                      : 'loading'}
                  </ul>
                </div>
                <div className='col-lg-6 col-sm-6 col-xs-12'>
                  <ul>
                    {props.data
                      ? props.data.Why2.map((d, i) => (
                          <li key={`${d}-${i}`}> {d}</li>
                        ))
                      : 'loading'}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
