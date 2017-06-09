import React from 'react';
import Paper from 'material-ui/Paper';
import { Grid, Row, Col } from 'react-styled-flexboxgrid'

// TODO write more about website
class AboutPage extends React.Component {
  render() {
    const style = {
      color: 'black',
      width: '100%',
      margin: 'auto',
      textAlign: 'center',
      backgroundColor: 'white',
    }
    return  <Grid className="AboutPage">
              <Row>
                <Col xs={12}>
                    <Paper style={style} zDepth={5}>
                        <p><b>Mood</b> - is content consuming service</p>
                    </Paper>
                </Col>
              </Row>
            </Grid>
  }
}

export default AboutPage