import { useState, useEffect } from 'react';
import { Star, Send } from 'lucide-react';
import { reviewAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function ReviewSection({ roomId }) {
  const { isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Form state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  const fetchReviews = async (pageNum = 1) => {
    try {
      const { data } = await reviewAPI.getRoomReviews(roomId, { page: pageNum, limit: 5 });
      setReviews(pageNum === 1 ? data.data : [...reviews, ...data.data]);
      setTotalPages(data.pagination.pages);
      setPage(pageNum);
    } catch (err) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(1);
  }, [roomId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    if (!comment.trim()) {
      toast.error('Please write a comment');
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await reviewAPI.addReview({ roomId, rating, comment });
      toast.success('Review submitted successfully!');
      
      // Inject user name manually since the API returns the raw object without population on create
      const newReview = { ...data.data, user: { name: 'You' } };
      setReviews([newReview, ...reviews]);
      
      setRating(0);
      setComment('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const StarRating = ({ value, onChange, onHover, readOnly = false, size = "w-5 h-5" }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => onChange && onChange(star)}
            onMouseEnter={() => onHover && onHover(star)}
            onMouseLeave={() => onHover && onHover(0)}
            className={`focus:outline-none ${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform'}`}
          >
            <Star
              className={`${size} ${
                star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="mt-12 pt-8 border-t border-gray-border">
      <h2 className="text-2xl font-bold text-dark mb-6">Guest Reviews</h2>

      {/* Review Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-10 bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
          <h3 className="text-sm font-semibold text-dark mb-4 uppercase tracking-wider">Write a Review</h3>
          
          <div className="mb-4">
            <p className="text-sm text-gray-warm mb-2">Overall Rating</p>
            <StarRating 
              value={hoverRating || rating} 
              onChange={setRating} 
              onHover={setHoverRating}
              size="w-8 h-8"
            />
          </div>

          <div className="mb-4">
            <textarea
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this room..."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none text-sm"
              maxLength={1000}
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || rating === 0 || !comment.trim()}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
              {!submitting && <Send className="w-4 h-4" />}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-10 bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center">
          <p className="text-gray-warm text-sm">Please log in to leave a review for this room.</p>
        </div>
      )}

      {/* Review List */}
      {loading && page === 1 ? (
        <div className="animate-pulse space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review._id} className="pb-6 border-b border-gray-100 last:border-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {review.user?.name ? review.user.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-dark">{review.user?.name || 'Anonymous Guest'}</p>
                    <p className="text-xs text-gray-warm">
                      {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <StarRating value={review.rating} readOnly size="w-4 h-4" />
              </div>
              <p className="text-sm text-gray-dark leading-relaxed pl-13">{review.comment}</p>
            </div>
          ))}

          {page < totalPages && (
            <div className="text-center pt-4">
              <button
                onClick={() => fetchReviews(page + 1)}
                className="px-6 py-2 border border-gray-300 rounded-full text-sm font-medium text-dark hover:bg-gray-50 transition-colors"
              >
                Load More Reviews
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <Star className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-dark">No reviews yet</h3>
          <p className="text-sm text-gray-warm mt-1">Be the first to review this room!</p>
        </div>
      )}
    </div>
  );
}
