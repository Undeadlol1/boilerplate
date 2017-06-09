import React from 'react';
import { Link } from 'react-router';
import { translate } from '../containers/Translator'

class NotFound extends React.Component {
  render() {
    return  <h1 className="NotFound">{translate('page_not_found')}!</h1>
  }
}

export default NotFound