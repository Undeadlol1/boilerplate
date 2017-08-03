import React from 'react';
import Link from 'react-router/lib/Link';
import { translate } from '../containers/Translator'

class NotFound extends React.Component {
  render() {
    // align to center
    // TODO use flexbox for it?
    const style = {
      marginTop: '50%',
      textAlign: 'center',
    }
    return  <h1 style={style} className="NotFound">{translate('page_not_found')}!</h1>
  }
}

export default NotFound