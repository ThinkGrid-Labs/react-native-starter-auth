import React from 'react';
import { Image, StyleSheet, View, DimensionValue } from 'react-native';
import Images from '../../assets';
type Props = {
  height?: DimensionValue;
  width?: DimensionValue;
  mode?: 'contain' | 'cover' | 'stretch' | 'repeat' | 'center';
};

const Brand = ({ height, width, mode }: Props) => {
  return (
    <View testID={'brand-img-wrapper'} style={{ height, width }}>
      <Image testID={'brand-img'} style={styles.image} source={Images.logo} resizeMode={mode} />
    </View>
  );
};

Brand.defaultProps = {
  height: 200,
  width: 200,
  mode: 'contain',
};

export default Brand;

const styles = StyleSheet.create({
  image: { width: '100%' },
});
