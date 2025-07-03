import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

interface Product {
  price: string;
  amount: string;
}

export default function ComparePriceScreen() {
  const [products, setProducts] = useState<Product[]>([
    { price: '', amount: '' },
    { price: '', amount: '' },
  ]);
  const [result, setResult] = useState('');
  const [unitPrices, setUnitPrices] = useState<(number | null)[]>([]);

  const updateProduct = (index: number, field: 'price' | 'amount', value: string) => {
    const updated = [...products];
    updated[index][field] = value;
    setProducts(updated);
  };

  const addProduct = () => {
    setProducts([...products, { price: '', amount: '' }]);
  };

  const removeProduct = (index: number) => {
    const updated = [...products];
    updated.splice(index, 1);
    setProducts(updated);
  };

  const calculate = () => {
    const calculatedUnitPrices = products.map((p) => {
      const price = parseFloat(p.price);
      const amount = parseFloat(p.amount);
      if (price > 0 && amount > 0) {
        return price / amount;
      }
      return null;
    });

    setUnitPrices(calculatedUnitPrices);

    if (calculatedUnitPrices.some((p) => p === null)) {
      setResult('กรุณากรอกข้อมูลให้ครบและถูกต้อง');
      return;
    }

    const minPrice = Math.min(...(calculatedUnitPrices as number[]));
    const cheapestIndex = calculatedUnitPrices.indexOf(minPrice);

    setResult(`สินค้าตัวที่ ${cheapestIndex + 1} ถูกที่สุด (${minPrice.toFixed(2)} ต่อหน่วย)`);
  };

  const minPrice = unitPrices.length > 0 ? Math.min(...unitPrices.filter(p => p !== null) as number[]) : null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerIconContainer}>
          <Ionicons name="storefront-outline" size={32} color="white" />
        </View>
        <Text style={styles.title}>เปรียบเทียบราคาสินค้า</Text>
        <Text style={styles.subtitle}>หาสินค้าที่คุ้มค่าที่สุด</Text>
      </LinearGradient>

      {/* Products List */}
      <View style={styles.productsContainer}>
        {products.map((product, index) => {
          const unitPriceText =
            unitPrices.length > index && unitPrices[index] !== null
              ? `${unitPrices[index]?.toFixed(2)} ต่อหน่วย`
              : '-';
          
          const isLowestPrice = unitPrices[index] !== null && unitPrices[index] === minPrice;
          
          return (
            <View 
              key={index} 
              style={[
                styles.productCard,
                isLowestPrice && styles.bestPriceCard
              ]}
            >
              {/* Product Header */}
              <View style={styles.productHeader}>
                <View style={styles.productTitleContainer}>
                  <View style={[
                    styles.productNumber,
                    isLowestPrice && styles.bestPriceNumber
                  ]}>
                    <Text style={styles.productNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={[
                    styles.productTitle,
                    isLowestPrice && styles.bestPriceTitle
                  ]}>
                    สินค้าตัวที่ {index + 1}
                  </Text>
                </View>
                
                {products.length > 2 && (
                  <TouchableOpacity 
                    onPress={() => removeProduct(index)}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="trash-outline" size={20} color="#ef4444" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Best Price Badge */}
              {isLowestPrice && (
                <View style={styles.bestPriceBadge}>
                  <Ionicons name="trophy" size={16} color="#10b981" />
                  <Text style={styles.bestPriceBadgeText}>ราคาดีที่สุด!</Text>
                </View>
              )}

              {/* Input Fields */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>ราคา (บาท)</Text>
                <TextInput
                  style={[styles.input, isLowestPrice && styles.bestPriceInput]}
                  placeholder="0.00"
                  keyboardType="numeric"
                  value={product.price}
                  onChangeText={(value) => updateProduct(index, 'price', value)}
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>ปริมาณ/จำนวน</Text>
                <TextInput
                  style={[styles.input, isLowestPrice && styles.bestPriceInput]}
                  placeholder="0"
                  keyboardType="numeric"
                  value={product.amount}
                  onChangeText={(value) => updateProduct(index, 'amount', value)}
                  placeholderTextColor="#9ca3af"
                />
              </View>

              {/* Unit Price Display */}
              <View style={[
                styles.unitPriceContainer,
                isLowestPrice && styles.bestPriceUnitContainer
              ]}>
                <Text style={styles.unitPriceLabel}>ราคาต่อหน่วย:</Text>
                <Text style={[
                  styles.unitPriceValue,
                  isLowestPrice && styles.bestPriceValue
                ]}>
                  {unitPriceText}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={addProduct}>
          <LinearGradient
            colors={['#3b82f6', '#8b5cf6']}
            style={styles.gradientButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="add" size={20} color="white" />
            <Text style={styles.buttonText}>เพิ่มสินค้า</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.calculateButton} onPress={calculate}>
          <LinearGradient
            colors={['#10b981', '#059669']}
            style={styles.gradientButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="calculator" size={20} color="white" />
            <Text style={styles.buttonText}>คำนวณ</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Result */}
      {result ? (
        <View style={[
          styles.resultContainer,
          result.includes('กรุณา') ? styles.errorResult : styles.successResult
        ]}>
          <Text style={[
            styles.resultText,
            result.includes('กรุณา') ? styles.errorText : styles.successText
          ]}>
            {result}
          </Text>
          {!result.includes('กรุณา') && (
            <Text style={styles.resultSubtext}>
              คุณประหยัดได้มากที่สุดเมื่อเลือกสินค้าตัวนี้!
            </Text>
          )}
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    paddingBottom: 30,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  productsContainer: {
    paddingHorizontal: 20,
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  bestPriceCard: {
    borderColor: '#10b981',
    borderWidth: 2,
    backgroundColor: '#f0fdf4',
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  productTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bestPriceNumber: {
    backgroundColor: '#10b981',
  },
  productNumberText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  bestPriceTitle: {
    color: '#065f46',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#fef2f2',
  },
  bestPriceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  bestPriceBadgeText: {
    color: '#065f46',
    fontWeight: '600',
    fontSize: 12,
    marginLeft: 4,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: 'white',
    color: '#1f2937',
  },
  bestPriceInput: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
  },
  unitPriceContainer: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bestPriceUnitContainer: {
    backgroundColor: '#d1fae5',
  },
  unitPriceLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  unitPriceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  bestPriceValue: {
    color: '#065f46',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 10,
  },
  addButton: {
    flex: 1,
  },
  calculateButton: {
    flex: 1,
  },
  gradientButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  resultContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  successResult: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#10b981',
  },
  errorResult: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  successText: {
    color: '#065f46',
  },
  errorText: {
    color: '#dc2626',
  },
  resultSubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});