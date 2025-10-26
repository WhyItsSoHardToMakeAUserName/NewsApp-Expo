import { Image, Text, TouchableOpacity, View } from 'react-native';

type NewsCardProps = {
  urlToImage?: string;
  title: string;
  description?: string;
  publishedAt: string;
  url?: string;
};

export default function NewsCard({ title, description, urlToImage, publishedAt, url }:NewsCardProps) {
  return (
    <TouchableOpacity>
      <View style={{ marginBottom: 15, backgroundColor: '#fff', borderRadius: 10, overflow: 'hidden' }}>
        {urlToImage && (
          <Image source={{ uri: urlToImage }} style={{ height: 200, width: '100%' }} resizeMode="cover" />
        )}
        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{title}</Text>
          <Text numberOfLines={2} style={{ color: '#555' }}>{description}</Text>
          <Text style={{ fontSize: 12, color: '#999', marginTop: 5 }}>{publishedAt}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
