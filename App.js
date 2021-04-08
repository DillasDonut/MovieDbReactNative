import React, { useState } from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, TextInput, ScrollView, Image, TouchableHighlight, Modal, Alert} from 'react-native';

export default function App() {

  const apiurl="http://www.omdbapi.com/?apikey=d7f5ffbd"

  const [state, setState]= useState({
    // s:"Enter a movie title...",
    results: [],
    selected: {}
  })

  const search = () => {
    axios(apiurl + "&s=" + state.s).then(({ data }) => {
      let results=data.Search
      console.log(results)
      if (results == null){
        console.log('Results are null')
        alert('No results found !')
      }
      else{
      setState(prevState => {
        return {...prevState, results: results }
      })}
      })
    }
  

  const openPopup = id =>{
    axios(apiurl+"&i="+id).then(({ data }) => {
      let result=data
      setState(prevState => {
        return {...prevState, selected: result}
      })
    })
  }




  return (
    <View style={styles.container}>
      <Text style={styles.title}>What's that movie ?</Text>

      <TextInput
        style={styles.searchbox}
        placeholder="Type a movie name..."
        onChangeText={text=>setState(prevState=>{
          return {...prevState, s:text}
        })}
        onSubmitEditing={search}
        value={state.s} 
        autoFocus={true}
        />

        <ScrollView style={styles.results}>
          
          {state.results.map(result => (
            <TouchableHighlight 
              key={result.imdbID} 
              onPress={()=> openPopup(result.imdbID)}>
            <View style={styles.result}>
              <Image 
                source={{uri: result.Poster}}
                style={{
                  width:'100%',
                  height:300
                }}
                resizeMode="cover"
              />
              <Text style={styles.heading}>
                {result.Title}
              </Text>
            </View>
          </TouchableHighlight>
          ))}
        </ScrollView>

        
          <Modal 
          animationType="slide"
          
          transparent={false}
          visible={(typeof state.selected.Title != "undefined") ? true : false}
          >
           <TouchableHighlight
              onPress={() => setState(prevState => {
                return { ...prevState, selected: {} }
              })}
            >
              <Text style={styles.closeBtn}>Close</Text>
            </TouchableHighlight>
            <ScrollView>
            <View style={styles.popup}>
              <Text style={styles.poptitle}>{state.selected.Title}</Text>
              <Text style={{marginBottom:5}}>Ratings : {state.selected.imdbRating}</Text>
              <Text style={{marginBottom:5}}>{state.selected.Actors}</Text>
              <Text style={{marginBottom:5}}>{state.selected.Released}</Text>
              <Text style={{marginBottom:5}}>{state.selected.Country}</Text>
              <Text style={{marginBottom:36}}>{state.selected.Plot}</Text>
              <Image 
                  source={{uri: state.selected.Poster}}
                  style={{
                    width:270,
                    height:400
                  }}
                  resizeMode="contain"
                />
            </View>
           </ScrollView>
          </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: '#232931',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop:70,
    paddingHorizontal:25
  },
  title:{
    color:'#FFF',
    fontSize:32,
    fontWeight:'700',
    textAlign:'center'
  },
  searchbox:{
    fontSize:20,
    fontWeight: '300',
    padding :20,
    width :'100%',
    backgroundColor:'#eeeeee',
    borderRadius: 8,
    marginTop : 20,
    marginBottom : 40
  },
  results:{
    flex :1,
    flexDirection:'column'
  },
  result:{
    flex:1,
    width: '100%',
    marginBottom:20
  },
  heading:{
    color :'#FFF',
    fontSize:18,
    fontWeight:'700',
    padding:20,
    backgroundColor:'#445565'
  },
  popup:{
    padding:20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  poptitle:{
    fontSize:24,
    fontWeight:'700',
    marginBottom:5,
    color : '#4ecca3'
  },
  closeBtn:{
    padding:20,
    fontSize:20,
    color:'#FFF',
    fontWeight:'700',
    backgroundColor:'#2484C4'
  }
});
