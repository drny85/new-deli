import { Text } from '../ThemedText'

type Props = {
   description: string
   showFullDescription: boolean
   setShowFullDescription: () => void
   lenght: number
}
export const DescriptionText = ({
   description,
   showFullDescription,
   setShowFullDescription,
   lenght = 200
}: Props) => {
   return (
      <Text type="italic" fontSize="medium">
         {description && description.length > lenght && !showFullDescription
            ? description.slice(0, lenght) + '...'
            : description}
         {description && description.length > lenght && (
            <Text style={{ fontWeight: '800' }} onPress={setShowFullDescription} type="muted">
               {' '}
               {showFullDescription ? 'show less' : 'more'}
            </Text>
         )}
      </Text>
   )
}
