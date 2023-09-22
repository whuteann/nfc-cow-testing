import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { Prisma } from '@prisma/client';
import { family } from '@/models/Cow';

// Create styles
const styles = StyleSheet.create({
  body: {
    margin: 0,
    fontFamily: 'Montserrat',
    background: '#FFFFFF',
  },
  card_div: {
    backgroundColor: '#FFFFFF',
    height: '100%',
    width: '100%',
  },
  center_container: {
    textAlign: 'center',
    alignItems: 'center'
  },
  table: {
    paddingLeft: '8%', 
    paddingRight: '8%', 
    width: '100%', 
    display: 'flex', 
    flexDirection: 'column'
  },
  tableRow: {
    height: 'auto',
    display: 'flex',
	  flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '4%'
  },
  tableRowText: {
  	width: '100%',
    fontSize: '8px',
    paddingLeft: '6%',
    justifyContent: 'center'
  },
  tableRowImageContainer: {
    width: '15%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableRowTextContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  left: {
    width: '50px',
    height: '50px',
    backgroundColor: '#939598',
    transform: 'rotate(-45deg)',
    bottom: '-25px',
    left: '-25px',
    position: 'absolute',
  },
  center: {
    width: 0,
    height: 0,
    borderBottom: '50px solid #0E6A37',
    borderLeft: '138.5px solid white',
    transform: 'skew(-15deg)',
    bottom: 0,
    left: '5%',
    position: 'absolute',
  },
  right: {
    width: 0,
    height: 0,
    borderBottom: '50px solid #D1D3D4',
    borderLeft: '50px solid white',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});

interface coordinatorProps {
  coordinator: Prisma.FamilyCreateInput
}

//2.13in, 3.38in
//unit conversion constant = 54

// Create Document Component
const PakistanCoordinatorPDF = ({
  coordinator
}: coordinatorProps) => (

  <Document>
    <Page size="ID1" style={styles.body}>
      <View style={styles.card_div}>
        <View style={styles.center_container}>

          <View style={{paddingTop: '12px', position: 'relative'}}>
            <Image style={{height: '30px', width: 'auto'}} src={"/static/images/logo/icare-logo.png"}/>
          </View>

          <View style={{paddingTop: '5px'}}>
            <Text style={{textAlign: 'center', fontSize: '7px', fontFamily: 'Montserrat Bold' , color: '#0E6937'}}>ANIMAL DISPERSAL PROGRAM</Text>
          </View>
      
          <View style={{paddingTop: '10px', position: 'relative'}}>
            <Image style={{height: '65px', width: '65px', borderRadius: '40px', zIndex: 20}} src={coordinator.headshot}/>
          </View>

          <View style={{width: '100%', paddingTop: '5px', paddingBottom: '5px', paddingLeft: '10px', paddingRight: '10px', maxHeight: '41px', overflow: 'hidden'}}>
            <Text style={{textAlign: 'center', fontSize: '10px', fontFamily: 'Montserrat Bold'}}>{coordinator.name}</Text>
          </View>
        </View>
        
        <View style={styles.right}></View>
        <View style={styles.center}></View>
        <View style={styles.left}></View>

          {/* Table */}
          <View style={styles.table}>
            
            <View style={styles.tableRow}>
              <View style={styles.tableRowImageContainer}>
                <Image style={{height: '10px', width: 'auto'}} src={"/static/images/pdfIcon/green-address-logo.png"} />
              </View>

              <View style={styles.tableRowTextContainer}>
                <Text style={styles.tableRowText}>{(coordinator.townVillage as any).name}</Text>
              </View>
            </View>
            
            <View style={styles.tableRow}>
              <View style={styles.tableRowImageContainer}>
                <Image style={{height: '10px', width: 'auto'}} src={"/static/images/pdfIcon/green-city-logo.png"} />
              </View>

              <View style={styles.tableRowTextContainer}>
                <Text style={styles.tableRowText}>{(coordinator.townVillage as any).district?.name}</Text>
              </View>
            </View>
            
            <View style={styles.tableRow}>            
              <View style={styles.tableRowImageContainer}>
                <Image style={{height: '10px', width: 'auto'}} src={"/static/images/pdfIcon/green-district-logo.png"} />
              </View>

              <View style={styles.tableRowTextContainer}>
                <Text style={styles.tableRowText}>{coordinator?.province}</Text>
              </View>
            </View>
            
            <View style={styles.tableRow}>
              <View style={styles.tableRowImageContainer}>
                <Image style={{height: '10px', width: 'auto'}} src={"/static/images/pdfIcon/green-country-logo.png"} />
              </View>

              <View style={styles.tableRowTextContainer}>
                <Text style={styles.tableRowText}>{(coordinator.townVillage as any).district.country?.name}</Text>
              </View>
            </View>
            
          </View>
          {/* Table end */}
          

      </View>
    </Page>
  </Document>
);

Font.register({
  family: 'Montserrat',
  src: '/fonts/Montserrat-Regular.ttf'
});

Font.register({
  family: 'Montserrat Bold',
  src: '/fonts/Montserrat-Bold.ttf'
});

export default PakistanCoordinatorPDF;