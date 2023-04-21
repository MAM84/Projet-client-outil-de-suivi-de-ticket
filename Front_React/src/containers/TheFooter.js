import React, {Component} from 'react'
import { CFooter } from '@coreui/react'

class TheFooter extends Component {
  
  render(){
    return (
      <CFooter fixed={false}>
        <div>
          <span className="ml-1">2020 xxx</span>
        </div>
      </CFooter>
    )
  }
}

export default TheFooter
