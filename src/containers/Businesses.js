import React, {Component} from "react";
import {Business, NavMenu, Logo} from "../components/index";
import {Loader, Message, Table, Grid, Dimmer, Container
} from "semantic-ui-react";
import firebase from '../Firebase';


export default class Businesses extends Component {

    constructor(props) {
        super(props);
        this.ref = firebase.firestore().collection('businesses');
        this.unsubscribe = null;
        this.state = {
            error: null,
            isLoading: true,
            businesses: []
        };
    }

    onCollectionUpdate = (querySnapshot) => {
        const businesses = [];
        querySnapshot.forEach((doc) => {
            const {
                name,
                industry,
                stage,
                corpType,
                webpageUrl,
                fundingRound,
                numberOfEmployees,
            } = doc.data();
            businesses.push({
                key: doc.id,
                doc, // DocumentSnapshot
                id: doc.id,
                name,
                industry,
                stage,
                corpType,
                webpageUrl,
                fundingRound,
                numberOfEmployees,
            });
        });
        this.setState({
            businesses
        });
    };

  componentDidMount = () => {
    this.setState({ isLoading: true });
      this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
    this.setState({ isLoading: false });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.businesses.business !== prevState.count) {
      this.setState({ isLoading: true });
    }
  }
  handleDelete = (id) => {
    this.setState({businesses: this.state.businesses.filter(business => business.id !== id)})
  };

  render() {
    const cProps = {
    };

    const {error, isLoading, businesses} = this.state;

    return (
     <Container>
       <Logo/>
       <Grid>
         <Grid.Column width={4}>
           <NavMenu {...this.props} />
         </Grid.Column>
         <Grid.Column width={12}>
           <h2>
             Businesses List
           </h2>
           {error && <Message error content={error.message}/>}
           {isLoading && (
            <Dimmer active inverted>
              <Loader inverted/>
            </Dimmer>
           )}
           <Table celled singleLine>
             <Table.Header>
               <Table.Row>
                 <Table.HeaderCell>Name</Table.HeaderCell>
                 <Table.HeaderCell>Industry</Table.HeaderCell>
                 <Table.HeaderCell>Stage</Table.HeaderCell>
                 <Table.HeaderCell>Action</Table.HeaderCell>
               </Table.Row>
             </Table.Header>
             <Table.Body>
               {businesses.map(business => (
                <Business
                 key={Math.random()}
                 business={business}
                 {...this.props}
                 {...cProps}
                 handleDelete={this.handleDelete}
                />
               ))}
             </Table.Body>
           </Table>
         </Grid.Column>
       </Grid>
     </Container>
    );
  }
}
